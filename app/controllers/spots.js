'use strict';

/**
 * Module dependencies.
 */
const _ = require('lodash');

const mongoose = require('mongoose');
const tress = require('tress');
const {wrap: async} = require('co');

const Spot = mongoose.model('Spot');
const Forecast = mongoose.model('Forecast');
const Condition = mongoose.model('Condition');

const {uploadForecast, uploadCondition} = require('../controllers/builder');
const {getToday} = require('../utils');


var getForecast = async(function*(spotId) {
    var callData,
        spot;

    callData = yield Forecast.get(spotId);
    if (callData) {
        return callData;
    }

    // get spot
    spot = yield Spot.get(spotId);
    yield uploadForecast(spot.meta.mswd.id, spotId);

    return callData;
});

var getCondition = async(function*(spotId) {
    var callData,
        spot,
        startDate,
        endDate;

    callData = yield Condition.get(spotId);
    if (callData) {
        return callData;
    }

    spot = yield Spot.get(spotId);
    startDate = getToday() / 1000;
    endDate = new Date(getToday());
    endDate.setMonth(endDate.getMonth() + 1);
    endDate = endDate.setDate(endDate.getDate() - 1) / 1000;

    callData = yield uploadCondition(spot.meta.mswd.id, spot._id, startDate, endDate);

    return callData;
});


/**
 * List
 */

exports.index = async(function*(req, res) {
    const spots = yield Spot.list();
    res.json({
        data: spots
    });
});

exports.condition = async(function*(req, res) {
    const params = req.query;
    var forecast = [],
        condition = [],
        spots;


    if (params.spots) {
        spots = _.reduce(params.spots.split(','), function (result, id) {
            var id = _.parseInt(id.trim());
            if (id) {
                result.push(id);
            }
            return result;
        }, []);
    }

    var q = tress(async(function*(id, done) {
        var forecast = yield getForecast(id);
        var condition = yield getCondition(id);
        done(null, {
            forecast: forecast,
            condition: condition
        });
    }), 2);

    q.drain = function () {
        res.json({
            forecast: forecast,
            condition: condition
        });
    };

    q.error = function (err) {
        console.log('failed with error ' + err);
    };

    q.success = function (data) {
        forecast.push(data.forecast);
        condition.push(data.condition);
    };

    q.push(spots);
});


module.exports.getCondition = getCondition;
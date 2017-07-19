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
const {getToday, time} = require('../utils');


var getForecast = async(function*(spotId, endDate) {
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

var getCondition = async(function*(spotId, end) {
    var callData,
        spot,
        startDate,
        endDate;

    callData = yield Condition.get(spotId, end);
    if (callData) {
        return callData;
    }

    spot = yield Spot.get(spotId);

    startDate = time(getToday());
    endDate = new Date(getToday());
    endDate.setMonth(endDate.getMonth() + 1);
    endDate = time(endDate.setDate(endDate.getDate() - 1));

    yield uploadCondition(spot.meta.mswd.id, spot._id, startDate, endDate);
    callData = yield Condition.get(spotId, end);

    if (callData) {
        return callData;
    }
    return null;
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
    var endDate,
        paramEnd = _.parseInt(params.end),
        result = {},
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

    if (paramEnd) {
        endDate = paramEnd;
    }

    var q = tress(async(function*(id, done) {
        var forecast = yield getForecast(id, endDate),
            condition = yield getCondition(id, endDate),
            envData = {};

        envData[id] = {
            forecast: forecast,
            condition: condition
        };

        done(null, envData);
    }), 2);

    q.drain = function () {
        res.json(result);
    };

    q.error = function (err) {
        console.log('failed with error ' + err);
    };

    q.success = function (data) {
        _.merge(result, data);
    };

    q.push(spots);
});


module.exports.getCondition = getCondition;
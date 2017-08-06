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

const { uploadForecast, uploadCondition } = require('../controllers/builder');
const { getToday, getNow, time } = require('../utils');

const { forecastDataLifeTime } = require('../../config');


const getForecast = async(function*(spotId, end) {
    let callData;
    let start = getNow();

    // get spot
    const spot = yield Spot.get(spotId);

    /** need to refredh forecast in special period */
    if (start <= spot.updatedAt + forecastDataLifeTime) {
        callData = yield Forecast.get(spotId, end);

        if (callData) {
            return callData;
        }
    }

    let isUploaded = yield uploadForecast(spot.meta.mswd.id, spotId, start);

    if (!isUploaded) {
        return null;
    }

    callData = yield Forecast.get(spotId, end);

    if (callData) {
        return callData;
    }
    return null;
});

const getCondition = async(function*(spotId, end) {
    let callData,
        startDate,
        endDate;

    const spot = yield Spot.get(spotId);
    callData = yield Condition.get(spotId, end);

    if (callData) {
        return callData;
    }

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

const index = async(function*(req, res) {
    const spots = yield Spot.list();
    res.json({
        data: spots
    });
});

const getSpotsEnvironment = function(req, res) {
    const params = req.query;
    const endDate = _.parseInt(params.end) || null;

    let spots;

    if (params.spots) {
        spots = _.reduce(params.spots.split(','), (result, id) => {
            id = _.parseInt(id.trim());

            if (id) {
                result.push(id);
            }
            return result;
        }, []);
    }

    loadEnvironment(spots, endDate).then(environment => res.json(environment));
};

const loadEnvironment = function(spots, endDate) {
    let result = {};

    const q = tress(async(function*(id, done) {
        let forecast = yield getForecast(id, endDate);
        let condition = yield getCondition(id, endDate);
        let envData = {};

        envData[id] = {
            forecast: forecast,
            condition: condition
        };

        done(null, envData);
    }), 5);


    q.error = function (err) {
        console.log('failed with error ' + err);
    };

    q.success = function (data) {
        _.merge(result, data);
    };

    q.push(spots);

    return new Promise(function(resolve){
        q.drain = function () {
            resolve(result);
        };
    });
};


module.exports = {
    getCondition,
    getForecast,
    getSpotsEnvironment,
    loadEnvironment,
    index
};
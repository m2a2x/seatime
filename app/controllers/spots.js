'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const Spot = mongoose.model('Spot');
const Forecast = mongoose.model('Forecast');
const Condition = mongoose.model('Condition');

const { uploadForecast, uploadCondition } = require('../controllers/builder');
const { getToday } = require('../utils');


var getForecast = async(function* (spotId){
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

var getCondition = async(function* (spotId){
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

exports.index = async(function* (req, res) {
  const spots = yield Spot.list();
  res.json({
      data: spots
  });
});

exports.condition = async(function* (req, res){
    var spotId = req.params.id,
        data = {};

    data.forecast = yield getForecast(spotId);
    data.conditions = yield getCondition(spotId);
    res.json(data);
});


module.exports.getCondition = getCondition;
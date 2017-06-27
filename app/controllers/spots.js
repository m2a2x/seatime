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
        data = {},
        callData,
        spot,
        startDate,
        endDate;

    callData = yield Forecast.get(spotId);
    if (!callData) {
        // get spot
        spot = yield Spot.get(spotId);
        callData = yield uploadForecast(spot.meta.mswd.id, spotId);
    }

    data.forecast = callData;

    callData = yield Condition.get(spotId);
    if (!callData) {
        if (!spot) {
            // get spot
            spot = yield Spot.get(spotId);
        }

        startDate = getToday() / 1000;
        endDate = new Date(getToday());
        endDate = (endDate.setMonth(endDate.getMonth() + 1)) / 1000;

        callData = yield uploadCondition(spot.meta.mswd.id, spot._id, startDate, endDate);
    }
    data.conditions = callData;
    res.json(data);
});
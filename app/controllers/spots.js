'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: asyncf } = require('co');
const { getSpot, getForecast } = require('../controllers/crawler');
const Spot = mongoose.model('Spot');


/**
 * List
 */

exports.index = asyncf(function* (req, res) {
  /*
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const _id = req.query.item;
  const limit = 30;
  const options = {
    limit: limit,
    page: page
  };

  if (_id) options.criteria = { _id };
  */
  const spots = yield Spot.list();
  res.json({
      data: spots
  });
});

exports.forecast = asyncf(function* (req, res){
    const spot = yield Spot.findOne({_id: req.params.id});
    const forecast = yield getForecast(spot.meta.mswd.id);
    res.json({
        data: forecast
    });
});

exports.show = asyncf(function* (req, res){
  const spot = yield Spot.findOne({_id: req.params.id});
  const spotD = yield getSpot(spot.meta.mswd.id);
  res.json({
      data: spotD
  });
});
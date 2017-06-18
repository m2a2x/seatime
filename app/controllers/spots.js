'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: asyncf } = require('co');
const { getSpot } = require('../controllers/crawler');
const Spot = mongoose.model('Spot');


/**
 * List
 */

exports.index = asyncf(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const _id = req.query.item;
  const limit = 30;
  const options = {
    limit: limit,
    page: page
  };

  if (_id) options.criteria = { _id };

  const spots = yield Spot.list(options);
  res.json({
      data: spots
  });
});

exports.show = asyncf(function* (req, res){
  const spot = yield getSpot(req.params.id);
  res.json({
      data: spot
  });
});
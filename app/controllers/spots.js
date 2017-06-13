'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: asyncf } = require('co');

const { respond, respondOrRedirect } = require('../utils');
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
  const count = yield Spot.count();

  respond(res, 'spots/index', {
    title: 'Spots',
    spots: spots,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});

exports.show = asyncf(function* (req, res){
  var spot = yield getSpot(req.params.id);

  res.json(spot);
});
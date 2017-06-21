'use strict';

/**
 * Module dependencies.
 */

const _ = require('lodash');

const mongoose = require('mongoose');
const { wrap: asyncf } = require('co');
const Country = mongoose.model('Country');
const Spot = mongoose.model('Spot');


/**
 * List
 */

exports.index = asyncf(function* (req, res) {
  const countries = yield Country.list();
  const spots = yield Spot.list();

  res.json({
      data: {
          countries: _.keyBy(countries, '_id'),
          spots: _.keyBy(spots, '_id'),
          user: req.isAuthenticated() ? req.user : null,
          token: req.isAuthenticated() ? req.csrfToken() : null
      }
  });
});

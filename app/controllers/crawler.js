'use strict';

/**
 * Module dependencies.
 * Steal data
 */

const mongoose = require('mongoose');

const util = require('util');

const tress = require('tress');
const needle = require('needle');
const resolve = require('url').resolve;
const _ = require('lodash');

const Continent = mongoose.model('Continent');
const Country = mongoose.model('Country');
const Spot = mongoose.model('Spot');


exports.get = function(req, response) {
  var continents = {},
      countries = {},
      spots = [];


  var q = tress(function(url, callback){
    needle.get(url, function(err, res){
      if (err) throw err;

      var path = res.req.path;

      /**
       * CONTINENT LEVEL
       */

      if (~path.indexOf('continent?')) {
        getContinents(q, res.body, continents);
      }

      /**
       * COUNTRY LEVEL
       */

      else if (~path.indexOf('region?')) {
        getCountries(q, res.body, path, countries);
      }

      /**
       * SPOT LEVEL
       */

      else if (~path.indexOf('spot?')) {
        getSpots(res.body, path, spots);
      }

      callback();
    });
  }, 10);

  q.drain = function() {
    response.json({
      continents: continents,
      countries: countries,
      spots: spots
    });
  };

  q.push(getUrl('continent?'));
};


exports.getSpot = function(spotId) {
  var url = getUrl(
      'Tide?',
      '&spot_id=' + spotId
  );

  return new Promise(function(resolve, reject){
    needle.get(url, function(err, res){
      if (err) {
        reject(err);
      } else {
        resolve(res.body);
      }
    });
  });
};

exports.getForecast = function(spotId) {
    var url = getUrl(
        'forecast?',
        '&spot_id=' + spotId
    );

    return new Promise(function(resolve, reject){
        needle.get(url, function(err, res){
            if (err) {
                reject(err);
            } else {
                resolve(res.body);
            }
        });
    });
};


/**
 * URL
 */


function getUrl(getter, extraGetter) {
  var URL = 'http://magicseaweed.com';
  var api = '/api/4fa1b1a1cb45e3ade0ee1fe7560ff2ee/%s%s';
  var params = 'lang=en&units=uk&access_token=false%s&fields=*';

  params = util.format(params, extraGetter || '');
  return resolve(URL, util.format(api, getter, params));
}

/**
 * CONTINENT
 */

function getContinents(q, data, collection) {
  _.each(data, function (continent) {
    collection[continent._id] = continent;

    // next level call
    q.push(
        getUrl(
            'country?',
            '&continent_id=' + continent._id
        )
    );
  });
}

/**
 * COUNTRY
 */

function getCountries(q, data, path, collection) {
  var myRegexp = /(?:^|\&)continent_id=(.*?)(?:\&|$)/g;
  var parent_id = _.parseInt(myRegexp.exec(path)[1]);

  _.each(data, function (region) {

    _.each(region.countries, function (country) {
      collection[country._id] = country;
      country.region_id = region._id;
      country.continent_id = parent_id;

      // next level call
      q.push(
          getUrl(
              'spot?',
              '&country_id=' + country._id
          )
      );
    });
  });
}

/**
 * SPOT
 */

function getSpots(data, path, collection) {
  var myRegexp = /(?:^|\&)country_id=(.*?)(?:\&|$)/g;
  var parent_id = _.parseInt(myRegexp.exec(path)[1]);

  _.each (data, function(spot) {
    spot.country_id = parent_id;
    collection.push(spot);
  });
}
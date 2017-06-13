'use strict';

/**
 * Module dependencies.
 * Build data models and save it to database
 */

const mongoose = require('mongoose');
const tress = require('tress');
const { wrap: asyncf } = require('co');

const { respond, respondOrRedirect } = require('../utils');
const util = require('util');

const fs = require("fs");
const resolve = require('url').resolve;
const _ = require('lodash');

const Continent = mongoose.model('Continent');
const Country = mongoose.model('Country');
const Spot = mongoose.model('Spot');
const Counter = mongoose.model('Counter');

// test methods, read from file
exports.test = asyncf(function* (req, res) {
  var file = fs.readFileSync('assets/crawler.json'),
      jsonContent = JSON.parse(file);
  var idInc = yield Counter.getIncreament();

  jsonContent.countries = _.toArray(jsonContent.countries);

  var q = tress(function(job, done) {
    var id = idInc++,
        item;

    switch (job.type) {
      case 'Continent':
        item = new Continent(mapContinent(job, id));
        item.save(function () {
          var countries = _.remove(jsonContent.countries, function (item) {
            return item.continent_id === job._id;
          });

          q.push(_.map(countries, function (item) {
            return _.extend({}, item, {type: 'Country', parentId: id});
          }));
          done();
        });
        break;

      case 'Country':
        item = new Country(mapCountry(job, id, job.parentId));
        item.save(function (err) {
          console.log(err);
          var spots = _.remove(jsonContent.spots, function (item) {
            return item.country_id === job._id;
          });

          q.push(_.map(spots, function (item) {
            return _.extend({}, item, {type: 'Spot', parentId: id});
          }));
          done();
        });
        break;

      case 'Spot':
        item = new Spot(mapSpot(job, id, job.parentId));
        item.save(function (err) {
          console.log(err);
          done();
        });
        break;
    }
  }, 10);

  q.push(_.map(jsonContent.continents, function (item) {
      return _.extend({}, item, {type: 'Continent'});
    })
  );

  q.drain = asyncf(function* () {
    yield Counter.setIncreament(idInc);

    res.json({
      a: 'Finished with id ' + idInc
    });
  });
});

function mapContinent(continent, id) {
  return {
    _id: id,
    name: continent.name,
    meta: {
      mswd: {
        id: continent._id
      }
    }
  };
}

function mapCountry(item, id, parentId) {
  return {
      _id: id,
      _continent: parentId,
      name: item.name,
      meta: {
        mswd: {
          id: item._id,
          region_id: item.region_id
        }
      }
  };
}
function mapSpot(item, id, parentId) {
  return {
    _id: id,
    _country: parentId,
    name: item.name,
    description: item.description,
    isBigWave: item.isBigWave,
    optimumSwellAngle: item.optimumSwellAngle,
    optimumWindAngle: item.optimumWindAngle,
    hasAdvancedForecast: item.hasAdvancedForecast,
    meta: {
      offset: item.offset,
      mswd: {
        id: item._id,
        surfAreaId: item.surfAreaId,
        url: item.url,
        modelName: item.modelName
      },
      multiplier: item.multiplier,
      dataLat: item.dataLat,
      dataLon: item.dataLon,
      lat: item.lat,
      lon: item.lon,
      timeZoneAbbr: item.timeZoneAbbr,
      timezone: item.timezone
    }
  };
}
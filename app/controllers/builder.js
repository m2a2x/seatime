'use strict';

/**
 * Module dependencies.
 * Build data models and save it to database
 */

const mongoose = require('mongoose');
const tress = require('tress');
const { wrap: asyncf } = require('co');
const util = require('util');
const fs = require('fs');
const _ = require('lodash');

const mswd = require('../../assets/mswd');
const crawler = require('../controllers/crawler');

const Continent = mongoose.model('Continent');
const Country = mongoose.model('Country');
const Spot = mongoose.model('Spot');
const Counter = mongoose.model('Counter');
const Forecast = mongoose.model('Forecast');
const Condition = mongoose.model('Condition');

exports.merge = function (req, res) {};


// country name
// https://maps.googleapis.com/maps/api/geocode/json?address=Alaska&key=[key]

// test methods, read from file
exports.test = asyncf(function* (req, res) {
  var file,
      continentsDb,
      countriesDb,
      spotsDb,
      idIncContinent,
      idIncCountry,
      idIncSpot,
      q;

  yield mongoose.connection.db.dropDatabase();
  idIncContinent = yield Counter.getIncreament('continentId');
  idIncCountry = yield Counter.getIncreament('countryId');
  idIncSpot = yield Counter.getIncreament('spotId');

  file  = fs.readFileSync('assets/continents.json');
  continentsDb = JSON.parse(file);

  file  = fs.readFileSync('assets/countries.json');
  countriesDb = JSON.parse(file);

  file  = fs.readFileSync('assets/spots.json');
  spotsDb = JSON.parse(file);

  q = tress(function(job, done) {
    var item,
        id;

    switch (job.type) {
      case 'Continent':
        id = idIncContinent++;
        item = new Continent(mswd.mapContinent(job, id));
        item.save(function (err) {
          var countries = _.remove(countriesDb, function (item) {
            return item.continent_id === job._id;
          });
          if (err) {
                console.log(err);
          }
          q.push(_.map(countries, function (item) {
            return _.extend({}, item, {type: 'Country', parentId: id});
          }));
          done();
        });
        break;

      case 'Country':
        id = idIncCountry++;
        item = new Country(mswd.mapCountry(job, id, job.parentId));
        item.save(function (err) {
          if (err) {
            console.log(err);
          }
          var spots = _.remove(spotsDb, function (item) {
            return item.country_id === job._id;
          });

          q.push(_.map(spots, function (item) {
            return _.extend({}, item, {type: 'Spot', parentId: id});
          }));
          done();
        });
        break;

      case 'Spot':
        id = idIncSpot++;
        item = new Spot(mswd.mapSpot(job, id, job.parentId));
        item.save(function (err) {
          if (err) {
            console.log(err);
          }
          done();
        });
        break;
    }
  }, 10);

  q.push(_.map(continentsDb, function (item) {
      return _.extend({}, item, {type: 'Continent'});
    })
  );

  q.drain = asyncf(function* () {
    yield Counter.setIncreament('continentId', idIncContinent);
    yield Counter.setIncreament('countryId', idIncCountry);
    yield Counter.setIncreament('spotId', idIncSpot);

    res.json({
      Continent: idIncContinent,
      Country: idIncCountry,
      Spot: idIncSpot
    });
  });
});

exports.uploadForecast = asyncf(function* (mswdId, spotId) {
    var q,
        idName = 'forecastId',
        idInc,
        items,
        doc = Forecast;

    idInc = yield Counter.getIncreament(idName);
    items = yield crawler.getForecast(mswdId);

    q = tress(asyncf(function* (job, done) {
        var item,
            id,
            data;
        id = idInc++;

        data = mswd.mapForecast(job, id, spotId);
        item = new doc(data);
        item.save(function (err) {
            if (err) {
                console.log(err);
            }
            done();
        });
    }), 10);

    q.push(items);

    return new Promise(function(resolve){
        q.drain = asyncf(function * () {
            yield Counter.setIncreament(idName, idInc);
            resolve(true);
        });
    });
});

exports.uploadCondition = asyncf(function* (mswdId, spotId, start, end) {
    var q,
        idName = 'conditionId',
        idInc,
        items,
        doc = Condition;

    idInc = yield Counter.getIncreament(idName);
    items = yield crawler.getCondition(mswdId, start, end);

    q = tress(asyncf(function* (job, done) {
        var item,
            id,
            data;
        id = idInc++;
        data = mswd.mapCondition(job, id, spotId);
        item = new doc(data);
        item.save(function (err) {
            if (err) {
                console.log(err);
            }
            done(item);
        });
    }), 10);

    q.push(items);

    return new Promise(function(resolve){
        q.drain = asyncf(function * () {
            yield Counter.setIncreament(idName, idInc);
            resolve(true);
        });
    });
});
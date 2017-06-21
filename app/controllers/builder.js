'use strict';

/**
 * Module dependencies.
 * Build data models and save it to database
 */

const mongoose = require('mongoose');
const tress = require('tress');
const { wrap: asyncf } = require('co');
const mswd = require('../../assets/mswd');

const util = require('util');

const fs = require("fs");
const _ = require('lodash');

const Continent = mongoose.model('Continent');
const Country = mongoose.model('Country');
const Spot = mongoose.model('Spot');
const Counter = mongoose.model('Counter');

exports.merge = function (req, res) {};

// test methods, read from file
exports.test = asyncf(function* (req, res) {
  var file,
      continentsDb,
      countriesDb,
      spotsDb,
      idInc,
      q;

  yield mongoose.connection.db.dropDatabase();
  idInc = yield Counter.getIncreament();

  file  = fs.readFileSync('assets/continents.json');
  continentsDb = JSON.parse(file);

  file  = fs.readFileSync('assets/countries.json');
  countriesDb = JSON.parse(file);

  file  = fs.readFileSync('assets/spots.json');
  spotsDb = JSON.parse(file);

  q = tress(function(job, done) {
    var id = idInc++,
        item;

    switch (job.type) {
      case 'Continent':
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
    yield Counter.setIncreament(idInc);

    res.json({
      a: 'Finished with id ' + idInc
    });
  });
});
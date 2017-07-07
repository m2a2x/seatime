'use strict';

/**
 * Module dependencies.
 */

const _ = require('lodash');

const mongoose = require('mongoose');
const { wrap: asyncf } = require('co');
const tress = require('tress');

const Country = mongoose.model('Country');
const Spot = mongoose.model('Spot');
const User = mongoose.model('User');
const Pair = mongoose.model('Pair');


const { getCondition } = require('./spots');


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


exports.syncDevice = asyncf(function* (req, res) {
    const pair = yield Pair.getPair(req.body.pair);

    if (pair) {
        yield User.addDevice(req.user, pair.uuid, pair.device);
    }

    res.json({
        IsSuccesful: !!pair
    });
});

exports.pairDevice = asyncf(function* (req, res) {
    const user = yield getPairedUser(req.body.uuid);
    var pair;

    if (!user) {
        pair = yield Pair.setPair(req.body.uuid, req.body.device);
    }

    res.json({
        Pair: !user ? pair._id : null
    });
});

exports.getDeviceData = asyncf(function* (req, res) {
    const data = yield getDeviceData(req.query.uuid);
    res.json(data);
});

var getPairedUser = function (uuid) {
    return User.load({
        criteria: { 'preferenses.devices._id': uuid }
    });
};

var getDeviceData = asyncf(function* (uuid) {
    var q,
        spots,
        spotIds,
        conditions = {};

    spotIds = yield getPairedUser(uuid)
        .select('preferenses.favouriteSpots')
        .then(function (data) {
            return data.toObject().preferenses.favouriteSpots;
        });

    spots = yield Spot.getMany(spotIds);

    q = tress(function (id, done) {
        getCondition(id).then(function (data) {
            conditions[id] = data;
            done();
        });

    });

    q.push(spotIds);

    return new Promise(function(resolve){
        q.drain = function() {
            resolve({
                spots: spots,
                conditions: conditions
            });
        };
    });
});
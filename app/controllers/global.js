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

/*
exports.getSync = asyncf(function* (req, res) {
    const pair = yield Pair.getPair(req.user.id);

    res.json({
        pair: pair._id,
        time: pair.time
    });
});
*/
/*
exports.syncDevice = asyncf(function* (req, res) {
    const pair = yield Pair.findPair(req.body.pair);
    var data;

    if (!pair) {
        res.status(404);
        return;
    }

    yield User.addDevice(pair.user_id, req.body.uuid, req.body.name);

    data = yield getDeviceData({
        _id: pair.user_id
    });
    res.json(data);
});
*/

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
    const pair = yield Pair.setPair(req.body.uuid, req.body.device);

    res.json({
        IsSuccesful: !!pair,
        Pair: pair && pair._id || null
    });
});

exports.getDeviceData = asyncf(function* (req, res) {
    const data = yield getDeviceData({'preferenses.devices._id': req.query.uuid});
    res.json(data);
});

var getDeviceData = asyncf(function* (criteria) {
    var q,
        spots,
        spotIds,
        conditions = {};

    spotIds = yield User.load({
        criteria: criteria,
        select: 'preferenses.favouriteSpots'
    }).then(function (data) {
        const user = data.toObject();
        return user.preferenses.favouriteSpots;
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
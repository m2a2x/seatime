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
    var resData = {},
        q,
        fields = [],
        qspots,
        favouritespots,
        params = req.query;


    if (req.isAuthenticated()) {
        resData.user = req.user;
    }

    if (params.spots) {
        qspots =_.reduce(params.spots.split(','), function (result, id) {
            var id = _.parseInt(field.trim());
            if (id) {
                result.push(id);
            }
            return result;
        }, []);
    }

    if (params.fields) {
        fields = _.map(params.fields.split(','), function (name) {
            return name.trim();
        });


        q = tress(function (job, done) {
            var promise;
            switch (job) {
                case 'countries':
                    promise = Country.list();
                    promise.then(function(data) {
                        done(null, {
                            countries: data
                        });
                    });
                    break;
                case 'favourite':
                    if (!resData.user) {
                        done('User is not logged in');
                        return;
                    }
                    favouritespots = resData.user.preferenses.favouriteSpots;
                    if (!favouritespots || !favouritespots.length) {
                        done(null);
                        return;
                    }
                case 'spots':
                    var spots = favouritespots || qspots;
                    if (spots && spots.length) {
                        promise = Spot.getMany(spots);
                    } else {
                        promise = Spot.list();
                    }

                    promise.then(function(data) {
                        done(null, {
                            spots: data
                        });
                    });
                    break;
                default:
                    done('Unexpected Field Name Parameter ' + job);
            }
        });

        q.push(fields);
        q.error = function(err) {
            console.log(err);
        };

        q.success = function(data) {
          _.merge(resData, data);
        };
        q.drain = function() {
            res.json(resData);
        };
    } else {
        res.json(resData);
    }
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
    var pair, data;

    if (!user) {
        pair = yield Pair.setPair(req.body.uuid, req.body.device);
        res.json({
            Pair: pair._id
        });
        return;
    }

    data = yield getDeviceData(req.body.uuid);
    res.json({
        PairedData: data
    });

});

exports.getDeviceData = asyncf(function* (req, res) {
    const data = yield getDeviceData(req.query.uuid);
    res.json(data);
});

var getPairedUser = function (uuid, select) {
    return User.load({
        criteria: { 'preferenses.devices._id': uuid },
        select: select
    });
};

var getDeviceData = asyncf(function* (uuid) {
    var q,
        spots,
        spotIds,
        conditions = [],
        tides = [];

    function response(resolve, spots, conditions, tides) {
        return function() {
            resolve({
                spots: spots,
                conditions: conditions,
                tides: tides
            });
        };
    }

    spotIds = yield (getPairedUser(uuid, 'preferenses.favouriteSpots')
        .then(function (data) {
            return data && data.toObject().preferenses.favouriteSpots || [];
        }));

    if (!spotIds.length) {
        return new Promise(function(resolve){
            response(resolve, null, null, null)();
        });
    }

    spots = yield Spot.getMany(spotIds);

    q = tress(function (id, done) {
        getCondition(id).then(function (data) {
            _.each(data, function (item) {
                item = item.toObject();

                _.each(item.tide, function(t) {
                    tides.push(_.extend(t, {
                        spot_id: id
                    }));
                });

                delete item.tide;
                item.spot_id = id;
                conditions.push(item);
            });
            done();
        });

    });

    q.push(spotIds);

    return new Promise(function(resolve){
        q.drain = response(resolve, spots, conditions, tides);
    });
});
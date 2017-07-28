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

const { loadEnvironment } = require('./spots');

const syncDevice = asyncf(function* (req, res) {
    const pair = yield Pair.getPair(req.body.pair);

    if (pair) {
        yield User.addDevice(req.user, pair.uuid, pair.device);
    }

    res.json({
        isSuccesful: !!pair
    });
});

const pairDevice = asyncf(function* (req, res) {
    const endDate = _.parseInt(req.body.end) || null;
    const user = yield User.load({
        criteria: { 'preferenses.devices._id': req.body.uuid }
    });

    let pair,
        data;

    if (!user) {
        pair = yield Pair.setPair(req.body.uuid, req.body.device);
        res.json({
            Pair: pair._id
        });
        return;
    }

    data = yield loadDeviceData(req.body.uuid, endDate);
    res.json({
        PairedData: data
    });

});

const loadDeviceData = asyncf(function* (uuid, endDate) {
    const spots = yield User.getFavouriteByUuid(uuid);

    if (!spots.length) {
        return new Promise(function(resolve){
            resolve({
                spots: null,
                conditions: null,
                tides: null
            });
        });
    }


    /* q = tress(function (spot, done) {
        let id = spot._id;

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

    }); */

    return loadEnvironment(_.map(spots, '_id'), endDate).then(environment => {
        return {
            environment: environment,
            spots: spots
        }
    });
});

module.exports = {
    pairDevice,
    syncDevice
};
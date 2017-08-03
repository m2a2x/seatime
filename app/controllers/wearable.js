/**
 * Module dependencies.
 */
'use strict';

const _ = require('lodash');

const mongoose = require('mongoose');
const { wrap: asyncf } = require('co');
const tress = require('tress');

const Country = mongoose.model('Country');
const Spot = mongoose.model('Spot');
const User = mongoose.model('User');
const Pair = mongoose.model('Pair');

const { loadEnvironment } = require('./spots');
const { respondError } = require('../utils/index');

const syncDevice = asyncf(function* (req, res) {
    const pair = yield Pair.getPair(req.body.pair);

    if (pair) {
        yield User.addDevice(req.user, pair.uuid, pair.device);
    }

    res.json({
        isSuccesful: !!pair
    });
});

const pairDevice = asyncf(function*(req, res) {
    const isPaired = yield getPaired(req.body.uuid);

    if (!isPaired) {
        Pair.setPair(req.body.uuid, req.body.device).then(pair => res.json({
            Pair: pair._id
        }));
        return;
    }

    User.getFavouriteByUuid(req.body.uuid).then(spots => res.json({
        PairedData: {
            spots: spots
        }
    }));
});

const getPaired = asyncf(function* (uuid) {
    const user = yield User.load({
        criteria: { 'preferenses.devices._id': uuid }
    });

    return !!user;
});

const loadData = asyncf(function*(req, res) {
    const endDate = _.parseInt(req.body.end) || null;
    const spotId = _.parseInt(req.body.spot);

    if (!spotId || !req.body.uuid) {
        respondError(res, 404);
        return;
    }
    const isPaired = yield getPaired(req.body.uuid);

    if (!isPaired) {
        pairDevice(req, res);
        return;
    }

    loadEnvironment([spotId], endDate).then(environment =>
        res.json(_.merge(environment[spotId], {
            spot_id: spotId
        }))
    );
});

module.exports = {
    syncDevice,
    pairDevice,
    loadData
};
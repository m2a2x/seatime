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

const pairDevice = function (req, res) {

    if (!isPaired(req.body.uuid)) {
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
};

const isPaired = asyncf(function* (uuid) {
    const user = yield User.load({
        criteria: { 'preferenses.devices._id': uuid }
    });

    return !!user;
});

const loadData = function (req, res) {
    const endDate = _.parseInt(req.body.end) || null;
    const spot = req.body.spot;

    if (!spot || !req.body.uuid) {
        respondError(res, 404);
        return;
    }

    if (!isPaired(req.body.uuid)) {
        pairDevice(req, res);
        return;
    }

    loadEnvironment([spot], endDate).then(environment => {
        res.json(environment);
    });
};

module.exports = {
    pairDevice,
    syncDevice,
    loadData
};
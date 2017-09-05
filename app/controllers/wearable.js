'use strict';


const mongoose = require('mongoose');
const Country = mongoose.model('Country');
const Spot = mongoose.model('Spot');
const User = mongoose.model('User');
const Pair = mongoose.model('Pair');

const _ = require('lodash');
const moment = require('moment');
const { wrap: asyncf } = require('co');
const tress = require('tress');

const SeaError = require('../libs/SeaError');
const { getNow } = require('../utils/index');
const { loadEnvironment } = require('./spots');
const { deprecateUnixTimeDifference } = require('../../config');


const syncDevice = asyncf(function* (req, res) {
    let pair = yield Pair.getPair(req.body.pair);

    if (pair) {
        yield User.addDevice(req.user, pair.uuid, pair.device);
    }

    res.json({
        isSuccesful: !!pair
    });

});

const pairDevice = asyncf(function*(req, res, next) {
    const startDate = _.parseInt(req.body.deviceTime) || null;
    const endDate = _.parseInt(req.body.end) || moment().add(1, 'days').unix();
    const timestamp = req.body.timestamp;

    if (!req.body.uuid) {
        return next(new SeaError('UUID required', 406));
    }

    let isPaired = yield getPaired(req.body.uuid);
    let userData;

    if (!isPaired) {
        Pair.setPair(req.body.uuid, req.body.device).then(pair => res.json({
            pair: pair._id
        }));
        return;
    }

    userData = yield getUserData(req.body.uuid, timestamp);
    checkTime(startDate, res);
    if (!userData) {
        return res.json({
            result: null
        });
    }

    loadEnvironment(_.map(userData.spots, '_id'), endDate).then(environments => {
        let result = _.merge(userData, {
            condition: [],
            forecast: []
        });
        _.each(environments, (env, spotId) => {
            let rich = mapEnvironment(env, _.parseInt(spotId));
            result.condition = result.condition.concat(rich.condition);
            result.forecast = result.forecast.concat(rich.forecast);
        });
        res.json({
            result: result
        });
    });
});

const getPaired = asyncf(function* (uuid) {
    let user = yield User.load({
        criteria: { 'preferenses.devices._id': uuid }
    });

    return !!user;
});

const loadData = asyncf(function*(req, res, next) {
    const startDate = _.parseInt(req.body.deviceTime) || null;
    const endDate = _.parseInt(req.body.end) || null;
    const spotId = _.parseInt(req.body.spot);

    if (!req.body.uuid) {
        return next(new SeaError('UUID Required.', 406));
    }

    if (!spotId) {
        return next(new SeaError('Requested spot not found.', 406));
    }

    let isPaired = yield getPaired(req.body.uuid);
    checkTime(startDate, res);
    if (!isPaired) {
        pairDevice(req, res);
        return;
    }

    loadEnvironment([spotId], endDate).then(environment => {
        res.json(mapEnvironment(environment[spotId], spotId));
    });
});

function mapEnvironment(fields, spotId) {
    _.each(fields, (field) => {
        _.each(field, (v) => {
           _.merge(v, {
               spot_id: spotId
           })
        });
    });

    return fields;
}

function checkTime(timestamp, res) {
    if (Math.abs(timestamp - getNow()) > deprecateUnixTimeDifference) {
        res.status(206);
        return false;
    }
    return true;
}

const getUserData = asyncf(function* (uuid, timestamp) {
    let userData = yield User.getFavouriteByUuid(uuid, timestamp);
    if (!userData) {
        return null;
    }
    userData.spots = _.map(userData.spots, (spot) => {
        _.merge(spot, spot.meta);
        delete spot.meta;
        return spot;
    });
    return userData;
});

module.exports = {
    syncDevice,
    pairDevice,
    loadData
};
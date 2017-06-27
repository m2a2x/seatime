'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getToday } = require('../utils');

/**
 * Tide Schema
 */

const TideSchema = new Schema({
    shift: Number,
    state: String,
    timestamp: Number
});


/**
 * Port Schema
 */

const PortSchema = new Schema({
    name: String,
    lat: Number,
    lon: Number,
    distance: Number,
    unit: String
})

/**
 * Condition Schema
 */

const ConditionSchema = new Schema({
    _id: Number,
    _spot: { type: Number, ref: 'Spot' },
    tide: [TideSchema],
    sunriseTwilight: Number,
    sunrise: Number,
    sunsetTwilight: Number,
    sunset: Number,
    meta: {
        timestamp: Number,
        mswd: {
            images: {
                full: String
            }
        },
        unit: String
    },
    port: PortSchema,
    createdAt: { type : Date, default : Date.now }
});

/**
 * Statics
 */

ConditionSchema.statics = {
    get: function (spotId) {
        var dt = getToday() / 1000,
            fields = ['tide'];

        return this.find({_spot: spotId, 'meta.timestamp': {$gt: dt}})
            .select(fields)
            .exec()
            .then(function (data) {
                return data || null
            });
    }
};

mongoose.model('Condition', ConditionSchema);

'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getToday, time } = require('../utils');

/**
 * Condition Port Sub Schema
 */

const PortSchema = new Schema({
    name: String,
    lat: Number,
    lon: Number,
    distance: Number,
    unit: String
}, { _id : false });

/**
 * Condition Tide Sub Schema
 */

const TideSchema = new Schema({
    shift: Number,
    state: String,
    timestamp: Number
}, { _id : false });

/**
 * Condition Meta Sub Schema
 */

const MetaSchema = new Schema({
    timestamp: Number,
    mswd: {
        images: {
            full: String
        }
    },
    unit: String
}, { _id : false });

/**
 * Condition Schema
 */

const ConditionSchema = new Schema({
    _spot: { type: Number, ref: 'Spot' },
    tide: [TideSchema],
    sunriseTwilight: Number,
    sunrise: Number,
    sunsetTwilight: Number,
    sunset: Number,
    meta: MetaSchema,
    port: PortSchema,
    createdAt: { type : Date, default : Date.now }
});


/**
 * Statics
 */

ConditionSchema.statics = {
    get: function (spotId, endDate) {
        let dt = time(getToday()),
            comparator = {$gt: dt};

        if (endDate && endDate > dt) {
            comparator['$lt'] = endDate;
        }

        return this.find({_spot: spotId, 'meta.timestamp': comparator}, '-_id tide')
            .lean()
            .then(function (data) {
                if (data.length) {
                    return data;
                }
                return null;
            });
    }
};

mongoose.model('Condition', ConditionSchema);

'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getToday, time, daysToTime } = require('../utils');

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
    get: function (spotId, endDate) {
        var dt = time(getToday()),
            fields = ['tide'],
            comparator = {$gt: dt};

        if (endDate && endDate > dt) {
            comparator['$lt'] = endDate;
        }

        return this.find({_spot: spotId, 'meta.timestamp': comparator})
            .select(fields)
            .exec()
            .then(function (data) {
                if (data.length) {
                    return data;
                }
                return null;
            });
    }
};

mongoose.model('Condition', ConditionSchema);

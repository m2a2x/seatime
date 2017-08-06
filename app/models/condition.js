'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getToday, time } = require('../utils');

/**
 * Port Schema
 */

const PortSchema = new Schema({
    name: String,
    lat: Number,
    lon: Number,
    distance: Number,
    unit: String
});

/**
 * Condition Schema
 */

const ConditionSchema = new Schema({
    _id: Number,
    _spot: { type: Number, ref: 'Spot' },
    tide: [{
        shift: Number,
        state: String,
        timestamp: Number
    }],
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

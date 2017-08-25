'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * Spot Schema
 */

const SpotSchema = new Schema({
    _id: Number,
    _country: {type: Number, ref: 'Country'},
    name: {type: String, default: '', trim: true},
    description: {type: String, default: '', trim: true},
    isBigWave: Boolean,
    optimumSwellAngle: Number,
    optimumWindAngle: Number,
    hasAdvancedForecast: Boolean,
    meta: {
        offset: Number,
        mswd: {
            id: Number,
            surfAreaId: Number,
            url: {type: String, default: '', trim: true},
            modelName: String
        },
        multiplier: Number,
        dataLat: Number,
        dataLon: Number,
        lat: Number,
        lon: Number,
        timeZoneAbbr: String,
        timezone: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Number, default: 0 }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

SpotSchema
    .virtual('timezone')
    .get(function () {
        return this.meta.timezone;
    });

/**
 * Statics
 */

SpotSchema.statics = {
    list: function () {
        return this.find({})
            .sort('country')
            .select('_id name _country meta.lon meta.lat')
            .exec();
    },

    setUpdated: function (id, timestamp) {
        return this.update({_id: id}, {
            $set: {
                'updatedAt': timestamp
            }
        });
    },

    get: function (id) {
        return this.findOne({_id: id});
    },

    getTimezone: function (id) {
        return this.findOne({_id: id})
            .exec()
            .then((data) => {
                return data.timezone;
            });
    },

    getMany: function (ids) {
        return this.find({
            _id: {$in: ids}
        })
        .select('_id name updatedAt')
        .exec();
    }
};

mongoose.model('Spot', SpotSchema);

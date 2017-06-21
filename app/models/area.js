'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 */

const AreaSchema = new Schema({
    _id: { type : Number, default : 0},
    name: { type : String, default : '', trim : true },
    meta: {
        mswd: {
            id: Number,
            url: { type : String, default : '', trim : true }
        },
        iso: { type : String, default : '', trim : true },
        createdAt  : { type : Date, default : Date.now }
    },
    country: { type: Number, ref: 'Country' },
    timezone: { type : String, default : '', trim : true }
});


mongoose.model('Area', AreaSchema);

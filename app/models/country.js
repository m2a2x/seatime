'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Country Schema
 */

const CountrySchema = new Schema({
  _id: { type : Number, default : 0},
  _continent: { type: Number, ref: 'Continent' },
  name: { type : String, default : '', trim : true },
  meta: {
    mswd: {
      id: Number,
      region_id: Number,
      url: { type : String, default : '', trim : true }
    },
    iso: { type : String, default : '', trim : true },
    createdAt  : { type : Date, default : Date.now }
  },
  surfAreas: [{ type: Number, ref: 'Area' }]
});

CountrySchema.statics = {
    list: function () {
        return this.find({}).exec();
    }
};

mongoose.model('Country', CountrySchema);
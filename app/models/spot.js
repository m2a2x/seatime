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
  _country: { type: Number, ref: 'Country' },
  name: { type : String, default : '', trim : true },
  description: { type : String, default : '', trim : true },
  isBigWave: Boolean,
  optimumSwellAngle: Number,
  optimumWindAngle: Number,
  hasAdvancedForecast: Boolean,
  meta: {
    offset: Number,
    mswd: {
      id: Number,
      surfAreaId: Number,
      url: { type : String, default : '', trim : true },
      modelName: String
    },
    multiplier: Number,
    dataLat: Number,
    dataLon: Number,
    lat: Number,
    lon: Number,
    timeZoneAbbr: String,
    timezone: String,
    createdAt  : { type : Date, default : Date.now }
  }
});


/**
 * Statics
 */

SpotSchema.statics = {
  /**
   * List spots
   *
   * @param {Object} options
   * @api private
   */

  list: function () {
    return this.find({}).sort('country').exec();
  },

  getSpot: function (_id) {
      const criteria = {_id};
      return this.find(criteria).exec();
  }
};

mongoose.model('Spot', SpotSchema);

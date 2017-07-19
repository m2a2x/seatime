'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const _ = require('lodash');
const { getToday, time } = require('../utils');
const Schema = mongoose.Schema;

const FieldsToParse = ['swell', 'wind', 'condition'];


/**
 * Forecast Schema
 */

const ForecastSchema = new Schema({
  _id: Number,
  _spot: { type: Number, ref: 'Spot' },

  meta: {
      timestamp: Number,
      localTimestamp: Number,
      issueTimestamp: Number,
      fadedRating: Number,
      solidRating: Number,
      en_threeHourTimeText: String,
      threeHourTimeText: String,
      timezoneAbbr: String,


      mswd: {
          model: {
              id: Number,
              name: String
          },

          charts: {
              swell: String,
              period: String,
              wind: String,
              pressure: String,
              sst: String
          }
      }
  },

  swell: String, /** TO PARSE */
  wind: String, /** TO PARSE */
  condition: String, /** TO PARSE */
  createdAt  : { type : Date, default : Date.now },
  updatedAt: { type : Date, default : Date.now }
});

/**
 * Statics
 */

ForecastSchema.statics = {
    get: function (id, endDate) {
        var dt = time(getToday()),
            fields = ['swell'],
            comparator = {$gt: dt};

        if (endDate && endDate > dt) {
            comparator['$lt'] = endDate;
        }

        return this
            .find({_spot: id, 'meta.localTimestamp': comparator})
            .sort('meta.localTimestamp')
            .select(fields)
            .exec()
            .then(function (data) {
                if (data.length) {
                    return _.map(data, function (model) {
                        var item = model.toObject();
                        _.each(FieldsToParse, function (key) {
                            if (item[key]) {
                                item[key] = JSON.parse(item[key]);
                            }
                        });
                        return item;
                    });
                }
                return null;
            });
    }
};



mongoose.model('Forecast', ForecastSchema);

/*
  swell: {
      height: Number,
          absHeight: Number,
          absMinBreakingHeight: Number,
          absMaxBreakingHeight: Number,
          incomingSwellCount: Number,
          direction: Number,
          trueDirection: Number,
          compassDirection: String,
          period: Number,
          probability: Number,
          unit: String,
          minBreakingHeight: Number,
          maxBreakingHeight: Number,
          components: {
          combined: {
              height: Number,
                  absHeight: Number,
                  period: Number,
                  windSeaFraction: Number,
                  power: Number,
                  direction: Number,
                  trueDirection: Number,
                  directionalSpread: Number,
                  compassDirection: String,
                  isOffshore: Boolean,
                  type: Number
          },
          primary: {
              height: Number,
                  absHeight: Number,
                  period: Number,
                  windSeaFraction: Number,
                  power: Number,
                  direction: Number,
                  trueDirection: Number,
                  directionalSpread: Number,
                  compassDirection: String,
                  isOffshore: Boolean,
                  type: Number,
                  absBreakingHeight: Number
          },
          secondary: {
              height: Number,
                  absHeight: Number,
                  period: Number,
                  windSeaFraction: Number,
                  power: Number,
                  direction: Number,
                  trueDirection: Number,
                  directionalSpread: Number,
                  compassDirection: String,
                  isOffshore: Boolean,
                  type: Number,
                  absBreakingHeight: Number
          },
          tertiary: {
              height: Number,
                  absHeight: Number,
                  period: Number,
                  windSeaFraction: Number,
                  power: Number,
                  direction: Number,
                  trueDirection: Number,
                  directionalSpread: Number,
                  compassDirection: String,
                  isOffshore: Boolean,
                  type: Number,
                  absBreakingHeight: Number
          }
      }
  },
  wind: {
      speed: Number,
          direction: Number,
          trueDirection: Number,
          compassDirection: String,
          chill: Number,
          gusts: Number,
          unit: String,
          rating: Number,
          stringDirection: String
  },
  condition: {
      pressure: Number,
          temperature: Number,
          sst: Number,
          weather: Number,
          weatherText: String,
          unitPressure: String,
          unit: String
  }
*/
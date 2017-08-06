'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const _ = require('lodash');
const { getToday, time } = require('../utils');
const Schema = mongoose.Schema;


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
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

ForecastSchema
    .virtual('conditionData')
    .get(function () {
        let json = JSON.parse(this.condition);
        let conditionData = _.pick(json,
            [
                'temperature',
                'weather',
                'unit'
            ]
        );
        return conditionData;
    });

ForecastSchema
    .virtual('swellData')
    .get(function () {
        let json = JSON.parse(this.swell);
        let swellData = _.pick(json,
            [
                'compassDirection',
                'period',
                'unit'
            ]
        );
        swellData.power = json.components.combined.power;
        swellData.height = Math.round(json.components.combined.height) || 0;
        return swellData;
    });

ForecastSchema
    .virtual('windData')
    .get(function () {
        const wind = JSON.parse(this.wind);
        return _.pick(
            wind,
            [
                'speed',
                'compassDirection',
                'unit',
                'stringDirection'
            ]
        );
    });


/**
 * Statics
 */

ForecastSchema.statics = {
    get: function (id, endDate) {
        const dt = time(getToday());
        let comparator = {$gt: dt};

        if (endDate && endDate > dt) {
            comparator['$lt'] = endDate;
        }

        return this
            .find({_spot: id, 'meta.localTimestamp': comparator})
            .sort('meta.localTimestamp')
            .exec()
            .then(function (data) {
                if (data.length) {
                    return _.map(data, function (item) {
                        return {
                            condition: item.conditionData,
                            swell: item.swellData,
                            wind: item.windData,
                            timestamp: item.meta.localTimestamp,
                            rating: item.meta.solidRating
                        };
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
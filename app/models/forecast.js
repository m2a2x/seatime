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
        const fields = ['height', 'period', 'power', 'compassDirection'];
        let json = JSON.parse(this.swell);
        let swell = {};

        _.each(['primary', 'secondary', 'combined'], (k) => {
            if (json.components[k]) {
                swell[k] = _.pick(json.components[k], fields);
            } else {
                swell[k] = _.pick(json, fields);
            }
        });

        _.each(swell, (s, k) => {
            if (!s.height) {
                swell[k].height = json.absHeight;
            }
            s.height = Math.round(s.height);
        });

        swell.unit = json.unit;

        return swell;
    });

ForecastSchema
    .virtual('windData')
    .get(function () {
        const windData = JSON.parse(this.wind);
        let wind = _.pick(
            windData,
            [
                'speed',
                'compassDirection',
                'unit',
                'stringDirection'
            ]
        );
        if (wind.stringDirection) {
            if (wind.stringDirection.toLowerCase().indexOf('onshore')) {
                wind.direction = 'On';
            } else if(wind.stringDirection.toLowerCase().indexOf('offshore')) {
                wind.direction = 'Off';
            } else {
                wind.direction = 'Cross';
            }
        }
        return wind;
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
                      compassDirection: String,
                      isOffshore: Boolean,
                      windSeaFraction: Number,
                      power: Number,
                      direction: Number,
                      trueDirection: Number,
                      directionalSpread: Number,
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
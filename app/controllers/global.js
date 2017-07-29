/**
 * Module dependencies.
 */
'use strict';

const _ = require('lodash');

const mongoose = require('mongoose');
const { wrap: asyncf } = require('co');
const tress = require('tress');
const { parseStringToIds } = require('../utils/index');

const Country = mongoose.model('Country');
const Spot = mongoose.model('Spot');
const User = mongoose.model('User');


/**
 * List
 */

exports.index = asyncf(function* (req, res) {
    let resData = {},
        q,
        fields = [],
        qspots,
        favouritespots,
        params = req.query;


    if (req.isAuthenticated()) {
        resData.user = req.user;
    }

    if (params.spots) {
        qspots = parseStringToIds(params.spots);
    }

    if (params.fields) {
        fields = _.map(params.fields.split(','), name => name.trim());


        q = tress(function (job, done) {
            let promise;
            switch (job) {
                case 'countries':
                    promise = Country.list();
                    promise.then(function(data) {
                        done(null, {
                            countries: data
                        });
                    });
                    break;
                case 'favourite':
                    if (!resData.user) {
                        done('User is not logged in');
                        return;
                    }
                    favouritespots = resData.user.preferenses.favouriteSpots;
                    if (!favouritespots || !favouritespots.length) {
                        done(null);
                        return;
                    }
                case 'spots':
                    let spots = favouritespots || qspots;
                    if (spots && spots.length) {
                        promise = Spot.getMany(spots);
                    } else {
                        promise = Spot.list();
                    }

                    promise.then(data => done(null, { spots: data }));
                    break;
                case 'spot_count':
                    promise = Spot.count({});
                    promise.then(count => done(null, { spot_count: count }));
                    break;
                default:
                    done('Unexpected Field Name Parameter ' + job);
            }
        }, 5);

        q.push(fields);
        q.error = function(err) {
            console.log(err);
        };

        q.success = function(data) {
          _.merge(resData, data);
        };
        q.drain = function() {
            res.json(resData);
        };
    } else {
        res.json(resData);
    }
});

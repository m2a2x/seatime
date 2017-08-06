'use strict';

/**
 * Module dependencies.
 * Steal data
 */

const tress = require('tress');
const needle = require('needle');
const fs = require('fs');
const _ = require('lodash');
const {getMswdUrl: getUrl, getMswdParams: getParams} = require('../../config/middlewares/mswd');


exports.get = function (req, response) {
    var continents = {},
        countries = {},
        spots = [],
        q;


    q = tress(function (data, callback) {
        needle.request('get', data.url, getParams(data.params), function (err, res) {
            if (err) throw err;
            const path = res.req.path;

            /**
             * CONTINENT LEVEL
             */

            if (~path.indexOf('continent?')) {
                getContinents(q, res.body, continents);
            }

            /**
             * COUNTRY LEVEL
             */

            else if (~path.indexOf('region?')) {
                getCountries(q, res.body, path, countries);
            }

            /**
             * SPOT LEVEL
             */

            else if (~path.indexOf('spot?')) {
                getSpots(res.body, path, spots);
            }

            callback();
        });
    }, 10);

    q.drain = function () {
        response.json({
            continents: continents,
            countries: countries,
            spots: spots
        });
    };

    q.push({
        url: getUrl('continent'),
        params: getParams({})
    });
};

/**
 * Condition
 */

exports.getCondition = function (spotId, start, end) {
    const url = getUrl('tide');

    const params = {
        spot_id: spotId,
        start: start,
        end: end
    };

    return new Promise((resolve, reject) => {
        needle.request('get', url, getParams(params), (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.body);
            }
        });
    });
};

/**
 * Forecast
 */

exports.getForecast = function (spotId) {
    const url = getUrl('forecast');
    const params = {
        spot_id: spotId
    };

    return new Promise((resolve, reject) => {
        needle.request('get', url, getParams(params), (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.body);
            }
        });
    });
};

/**
 * Continent
 */

function getContinents(q, data, collection) {
    const url = getUrl('country');
    _.each(data, (continent) => {
        collection[continent._id] = continent;

        // next level call
        const params = {
            continent_id: continent._id
        };
        q.push({url: url, params: params});
    });
}

/**
 * COUNTRY
 */

function getCountries(q, data, path, collection) {
    const myRegexp = /(?:^|\&)continent_id=(.*?)(?:\&|$)/g;
    const parent_id = _.parseInt(myRegexp.exec(path)[1]);
    const url = getUrl('spot');

    _.each(data, (region) => {

        _.each(region.countries, (country) => {
            collection[country._id] = country;
            country.region_id = region._id;
            country.continent_id = parent_id;

            // next level call
            const params = {
                country_id: country._id
            };
            q.push({url: url, params: params});
        });
    });
}

/**
 * SPOT
 */

function getSpots(data, path, collection) {
    const myRegexp = /(?:^|\&)country_id=(.*?)(?:\&|$)/g;
    const parent_id = _.parseInt(myRegexp.exec(path)[1]);

    _.each(data, (spot) => {
        spot.country_id = parent_id;
        collection.push(spot);
    });
}
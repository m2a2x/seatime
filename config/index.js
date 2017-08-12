'use strict';

const path = require('path');

const development = require('./env/development');
const production = require('./env/production');
const { daysToTime } = require('../app/utils/index');

const defaults = {
    root: path.join(__dirname, '..'),
    forecastDataLifeTime: daysToTime(1)
};

/**
 * Expose
 */

module.exports = {
    development: Object.assign({}, development, defaults),
    production: Object.assign({}, production, defaults),
}[process.env.NODE_ENV || 'development'];

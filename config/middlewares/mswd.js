
const _ = require('lodash');
const resolve = require('url').resolve;
const config = require('../');
const util = require('util');

module.exports = {
    getMswdUrl,
    getMswdParams
};


/**
 * URL
 */

function getMswdUrl(getter) {
    var URL = 'http://magicseaweed.com/api/';
    return resolve(URL, util.format('%s/%s', config.mswd.clientID, getter));
}

function getMswdParams(p) {
    var params = {
        lang: 'en',
        units: 'uk',
        access_token: false,
        fields: '*'
    };

    return _.merge(params, p)
}
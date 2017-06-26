
const resolve = require('url').resolve;
const config = require('../');
const util = require('util');

module.exports = {
    getMswdUrl
};


/**
 * URL
 */

function getMswdUrl(getter, extraGetter) {
    var URL = 'http://magicseaweed.com/api/';
    var params = 'lang=en&units=uk&access_token=false%s&fields=*';

    params = util.format(params, extraGetter || '');
    return resolve(URL, util.format('%s/%s%s', config.mswd.clientID, getter, params));
}

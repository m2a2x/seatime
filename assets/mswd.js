const _ = require('lodash');

exports.mapContinent = function(item, id) {
    var _item = new ItemWrapper(item);
    return {
        _id: id,
        name: _item.get('name'),
        meta: {
            mswd: {
                id: _item.get('_id')
            }
        }
    };
};

exports.mapCountry = function (item, id, parentId) {
    var _item = new ItemWrapper(item);
    return {
        _id: id,
        _continent: parentId,
        name: _item.get('name'),
        meta: {
            mswd: {
                id: _item.get('_id'),
                region_id: _item.get('region_id'),
                url: _item.get('url')
            },
            iso: _item.get('iso')
        },
        surfAreas: _.map(_item.get('surfAreas'), '_id')
    };
};

exports.mapSpot = function (item, id, parentId) {
    var _item = new ItemWrapper(item);
    return {
        _id: id,
        _country: parentId,
        name: _item.get('name'),
        description: _item.get('description'),
        isBigWave: _item.get('isBigWave'),
        optimumSwellAngle: _item.get('optimumSwellAngle'),
        optimumWindAngle: _item.get('optimumWindAngle'),
        hasAdvancedForecast: _item.get('hasAdvancedForecast'),
        meta: {
            offset: _item.get('offset'),
            mswd: {
                id: _item.get('_id'),
                surfAreaId: _item.get('surfAreaId'),
                url: _item.get('url'),
                modelName: _item.get('modelName')
            },
            multiplier: _item.get('multiplier'),
            dataLat: _item.get('dataLat'),
            dataLon: _item.get('dataLon'),
            lat: _item.get('lat'),
            lon: _item.get('lon'),
            timeZoneAbbr: _item.get('timeZoneAbbr'),
            timezone: _item.get('timezone')
        }
    };
};

exports.mapForecast = function(item, id, parentId) {
    var _item = new ItemWrapper(item);
    return {
        _id: id,
        _spot: parentId,

        meta: {
            timestamp: _item.get('timestamp'),
            localTimestamp: _item.get('localTimestamp'),
            issueTimestamp: _item.get('issueTimestamp'),
            fadedRating: _item.get('fadedRating'),
            solidRating: _item.get('solidRating'),
            en_threeHourTimeText: _item.get('en_threeHourTimeText'),
            threeHourTimeText: _item.get('threeHourTimeText'),
            timezoneAbbr: _item.get('timezoneAbbr'),


            mswd: {
                model: {
                    id: _item.get('model.id'),
                    name: _item.get('model.name')
                },

                charts: {
                    swell:  _item.get('charts.swell'),
                    period: _item.get('charts.period'),
                    wind: _item.get('charts.wind'),
                    pressure: _item.get('charts.pressure'),
                    sst: _item.get('charts.sst')
                }
            }
        },

        swell: _item.toString('swell'),
        wind: _item.toString('wind'),
        condition: _item.toString('condition')
    };
};

exports.mapCondition = function (item, id, parentId) {
    var _item = new ItemWrapper(item);
    return {
        _id: id,
        _spot: parentId,
        tide: _item.get('tide'),
        sunriseTwilight: _item.get('sunriseTwilight'),
        sunrise: _item.get('sunrise'),
        sunsetTwilight: _item.get('sunsetTwilight'),
        sunset: _item.get('sunset'),
        meta: {
            timestamp: _item.get('timestamp'),
            mswd: {
                images: {
                    full: _item.get('images.full')
                }
            },
            unit: _item.get('unit')
        },
        port: _item.get('port')
    };
};

function ItemWrapper(item) {
    var _this = this;

    _.extend(_this, {
        get: function (key) {
            return _.reduce(key.split('.'), function (result, key) {
                if (result) {
                    return result[key] || null;
                }
                return result;
            }, item);
        },
        toString: function (key) {
            return JSON.stringify(this.get(key));
        }
    });
}
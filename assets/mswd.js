const _ = require('lodash');

exports.mapContinent = function(continent, id) {
    return {
        _id: id,
        name: continent.name,
        meta: {
            mswd: {
                id: continent._id
            }
        }
    };
};

exports.mapCountry = function (item, id, parentId) {
    return {
        _id: id,
        _continent: parentId,
        name: item.name,
        meta: {
            mswd: {
                id: item._id,
                region_id: item.region_id,
                url: item.url
            },
            iso: item.iso
        },
        surfAreas: _.map(item.surfAreas, '_id')
    };
};

exports.mapSpot = function (item, id, parentId) {
    return {
        _id: id,
        _country: parentId,
        name: item.name,
        description: item.description,
        isBigWave: item.isBigWave,
        optimumSwellAngle: item.optimumSwellAngle,
        optimumWindAngle: item.optimumWindAngle,
        hasAdvancedForecast: item.hasAdvancedForecast,
        meta: {
            offset: item.offset,
            mswd: {
                id: item._id,
                surfAreaId: item.surfAreaId,
                url: item.url,
                modelName: item.modelName
            },
            multiplier: item.multiplier,
            dataLat: item.dataLat,
            dataLon: item.dataLon,
            lat: item.lat,
            lon: item.lon,
            timeZoneAbbr: item.timeZoneAbbr,
            timezone: item.timezone
        }
    };
};

exports.mapForecast = function(item, id, parentId) {
    return {
        _id: id,
        _spot: parentId,

        meta: {
            timestamp: item.timestamp,
            localTimestamp: item.localTimestamp,
            issueTimestamp: item.issueTimestamp,
            fadedRating: item.fadedRating,
            solidRating: item.solidRating,
            en_threeHourTimeText: item.en_threeHourTimeText,
            threeHourTimeText: item.threeHourTimeText,
            timezoneAbbr: item.timezoneAbbr,


            mswd: {
                model: {
                    id: item.model.id,
                    name: item.model.name
                },

                charts: {
                    swell: item.charts.swell,
                    period: item.charts.period,
                    wind: item.charts.wind,
                    pressure: item.charts.pressure,
                    sst: item.charts.sst
                }
            }
        },

        swell: JSON.stringify(item.swell),
        wind: JSON.stringify(item.wind),
        condition: JSON.stringify(item.condition)
    };
};

exports.mapCondition = function (item, id, parentId) {
    return {
        _id: id,
        _spot: parentId,
        tide: item.tide,
        sunriseTwilight: item.sunriseTwilight,
        sunrise: item.sunrise,
        sunsetTwilight: item.sunsetTwilight,
        sunset: item.sunset,
        meta: {
            timestamp: item.timestamp,
            mswd: {
                images: {
                    full: item.images.full
                }
            },
            unit: item.unit
        },
        port: item.port
    };
};
const moment = require('moment-timezone');
const _ = require('lodash');

module.exports = {
    parseStringToIds,
    respondOrRedirect,
    getToday,
    daysToTime,
    time,
    getNow,
    timeToUnixByTimezone
};

function respondOrRedirect({req, res}, url = '/', obj = {}, flash) {
    res.format({
        html: () => {
            if (req && flash) req.flash(flash.type, flash.text);
            res.redirect(url);
        },
        json: () => res.json(obj)
    });
}

function getNow() {
    return moment.utc().unix();
}

function getToday() {
    return moment.utc().startOf('day').valueOf();
}

function time(time) {
    return moment(time).utc().unix();
}

function daysToTime(days) {
    return days * 24 * 60 * 60;
}

function timeToUnixByTimezone(time, timezone) {
    // get a moment representing the current time
    let now = moment.unix(time).utcOffset(0);
    // create a new moment based on the original one
    let another = now.clone();

    // change the time zone of the new moment
    another.tz(timezone); // or whatever time zone you desire

    // shift the moment by the difference in offsets
    another.add(now.utcOffset() - another.utcOffset(), 'minutes');
    return another.unix();
}

function parseStringToIds(strIds) {
    return _.reduce(strIds.split(','), function (result, id) {
        id = _.parseInt(id.trim());
        if (id) {
            result.push(id);
        }
        return result;
    }, []);
}
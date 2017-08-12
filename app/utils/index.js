const moment = require('moment');
const _ = require('lodash');

module.exports = {
    parseStringToIds,
    respondOrRedirect,
    getToday,
    daysToTime,
    time,
    getNow
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

function parseStringToIds(strIds) {
    return _.reduce(strIds.split(','), function (result, id) {
        id = _.parseInt(id.trim());
        if (id) {
            result.push(id);
        }
        return result;
    }, []);
}
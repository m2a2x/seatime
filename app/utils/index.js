const moment = require('moment');
const _ = require('lodash');

module.exports = {
    parseStringToIds,
    respondError,
    respondOrRedirect,
    getToday,
    daysToTime,
    time
};

function respondError(res, status) {
    res.format({
        json: () => {
            let obj = {
                isSuccesful: false
            };
            if (status) return res.status(status).json(obj);
            res.json(obj);
        }
    });
}

function respondOrRedirect({req, res}, url = '/', obj = {}, flash) {
    res.format({
        html: () => {
            if (req && flash) req.flash(flash.type, flash.text);
            res.redirect(url);
        },
        json: () => res.json(obj)
    });
}

function getToday() {
    return moment().startOf('day').valueOf();
}

function time(time) {
    return moment(time).unix();
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
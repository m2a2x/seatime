const _ = require('moment');

module.exports = {
    respond,
    respondOrRedirect,
    getToday,
    daysToTime,
    time
};

function respond(res, tpl, obj, status) {
    res.format({
        html: () => res.render(tpl, obj),
        json: () => {
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
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d.getTime();
}

function time(time) {
    return time/1000;
}

function daysToTime(days) {
    return days * 24 * 60 * 60;
}
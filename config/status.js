'use strict';

/**
 * Errors handling
 *
*/

const _ = require('lodash');

module.exports = function (routes) {

    _.each(routes, (app) => {
        app.use(function (err, req, res, next) {
            let payload = {
                url: req.originalUrl,
                stack: err.stack
            };
            // treat as 404
            if (err.message
                && (~err.message.indexOf('not found')
                || (~err.message.indexOf('Cast to ObjectId failed')))) {
                return next();
            }

            console.error(err.stack);


            if (err.stack.includes('ValidationError')) {
                res.status(422);

                if (req.accepts('json')) {
                    return res.json(payload);
                }
                return res.render('error', { error: 'Validation error' });
            }

            res.status(err.status || 500);
            if (req.accepts('json')) {
                return res.json(payload);
            }
            res.render('error', { error: '500 error'});
        });

        // assume 404 since no middleware responded
        app.use(function (req, res) {
            const payload = {
                url: req.originalUrl,
                error: 'Not found'
            };
            if (req.accepts('json')) return res.status(404).json(payload);
            res.status(404).render('error', { error: 'Page not found' });
        });
    });
};

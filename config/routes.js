'use strict';

const users = require('../app/controllers/users');
const spots = require('../app/controllers/spots');
const global = require('../app/controllers/global');
const crawler = require('../app/controllers/crawler');
const builder = require('../app/controllers/builder');
const auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

const fail = {
  failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app, api, apiDevice, passport) {
    const pauth = passport.authenticate.bind(passport);

    /**
     * DB fill
     */
    app.get('/test', builder.test);
    app.get('/merge', builder.merge);

    /** Crawler, don't use without purpose */
    app.get('/crawler', auth.requiresLogin, crawler.get);

    /**
     * Local Auth
     */
    app.post('/users/session',
        pauth('local', {
            failureRedirect: fail.failureRedirect,
            failureFlash: 'Invalid email or password.'
        }), users.session);

    /** Facebook */
    app.get('/auth/facebook',
        pauth('facebook', {
            failureRedirect: fail.failureRedirect
        }), users.signin
    );
    app.get('/auth/facebook/callback', pauth('facebook', fail), users.authCallback);


    /** Google */
    app.get('/auth/google',
        pauth('google', {
            failureRedirect: fail.failureRedirect,
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin
    );
    app.get('/auth/google/callback', pauth('google', fail), users.authCallback);

    /** Logout */
    app.get('/logout', users.logout);


    /**
     * Api call
     */

    /** Load users param */
    api.param('userId', users.load);

    /** Get user by Id */
    api.get('/user/:userId', users.show);

    /** Global reload, return all data in one call */
    api.get('/reload/', global.index);

    /** Get Conditions  Get Forecasts */
    api.get('/spots/getConditions/', spots.condition);

    /** Set Sync and Pair */
    api.post('/sync', auth.requiresLogin, global.syncDevice);
    apiDevice.post('/pair', global.pairDevice);

    /** Get Device Data */
    api.get('/deviceData', global.getDeviceData);

    /** Get Favourite Spots */
    api.post('/user/spots/:id', auth.requiresLogin, users.addSpot);

    /** Get Remove Favouirite Spot */
    api.delete('/user/spots/:id', auth.requiresLogin, users.removeSpot);


    /**
     * Invalid call
     */

    api.get('*', function(req, res){
        res.send('Api doesn\'t exists', 404);
    });
    api.post('*', function(req, res){
        res.send('Api doesn\'t exists', 404);
    });
    api.delete('*', function(req, res){
        res.send('Api doesn\'t exists', 404);
    });
    api.put('*', function(req, res){
        res.send('Api doesn\'t exists', 404);
    });
};


/*app.get('/login', users.login);
 app.get('/signup', users.signup);
 app.post('/users', users.create);*/

/* Errors handling

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('404', payload);
  });
};
*/

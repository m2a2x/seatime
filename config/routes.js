/**
 * Route middlewares
 */
'use strict';

const auth = require('./middlewares/authorization');
const users = require('../app/controllers/users');
const global = require('../app/controllers/global');
const crawler = require('../app/controllers/crawler');
const builder = require('../app/controllers/builder');
const spots = require('../app/controllers/spots');
const wearable = require('../app/controllers/wearable');

const fail = {
  failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app, api, apiDevice, passport) {
    const pauth = passport.authenticate.bind(passport);

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
    api.get('/spots/getConditions/', spots.getSpotsEnvironment);

    /** Set Sync and Pair */
    api.post('/sync', auth.requiresLogin, wearable.syncDevice);

    /** Get Favourite Spots */
    api.post('/user/spots/:id', auth.requiresLogin, users.addSpot);

    /** Get Remove Favouirite Spot */
    api.delete('/user/spots/:id', auth.requiresLogin, users.removeSpot);

    /**
     * ApiDevice Service
     */
    apiDevice.post('/pair', wearable.pairDevice);
    apiDevice.post('/load', wearable.loadData);



    /**
     * Auth
     */

    /**Facebook */
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
};


/* Crawler, don't use without purpose */
// app.get('/crawler', auth.requiresLogin, crawler.get);

/*
 * Local Auth

 app.post('/users/session',
 pauth('local', {
 failureRedirect: fail.failureRedirect,
 failureFlash: 'Invalid email or password.'
 }), users.session);
 */

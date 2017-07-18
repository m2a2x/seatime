'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../');
const User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },
    function (accessToken, refreshToken, profile, done) {
        User.loginUser('facebook', profile, profile.emails[0].value, done);
    }
);

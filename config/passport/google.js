'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../');
const User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
  function (accessToken, refreshToken, profile, done) {
      User.loginUser('google', profile, profile.emails[0].value, done);
  }
);

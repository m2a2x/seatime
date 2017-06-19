'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const Spot = mongoose.model('Spot');
const _ = require('lodash');


/**
 * Load
 */

exports.load = async(function* (req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = yield User.load({ criteria });
    if (!req.profile) return next(new Error('User not found'));
  } catch (err) {
    return next(err);
  }
  next();
});

/**
 * Create user
 */

exports.create = async(function* (req, res) {
  const user = new User(req.body);
  user.provider = 'local';
  try {
    yield user.save();
    req.logIn(user, err => {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!');
      return res.redirect('/');
    });
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message);

    res.render('users/signup', {
      title: 'Sign up',
      errors,
      user
    });
  }
});

/**
 *  Show profile
 */

exports.show = function (req, res) {
  const user = req.profile;
  respond(res, 'users/show', {
    title: user.name,
    user: user
  });
};

exports.signin = function () {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  });
};

exports.getCurrent = function (req, res) {
    console.log(req.user);
    res.json({
        user: req.user,
        token: req.csrfToken()
    });
};

exports.removeSpot = async(function* (req, res, next) {
    var spot, user;
    const userId = req.user.id;
    try {
        spot = yield Spot.findOne({
            _id: _.parseInt(req.params.id)
        });
        if (!spot) return next(new Error('Spot not found'));
        user = yield User.findOne({
            _id: userId
        });
        if (!user) return next(new Error('User not found'));

        User.update( {_id: userId}, { $pullAll: {uid: [req.params.deleteUid] } } )
        user.preferenses.favouriteSpots.push(spot._id);
        yield user.save();
    } catch (err) {
        return next(err);
    }
    next();
});

exports.addSpot = async(function* (req, res, next) {
    var spot, user;
    const userId = req.user.id;
    try {
        spot = yield Spot.findOne({
            _id: _.parseInt(req.params.id)
        });
        if (!spot) return next(new Error('Spot not found'));
        user = yield User.findOne({
            _id: userId
        });
        if (!user) return next(new Error('User not found'));

        user.preferenses.favouriteSpots.push(spot._id);
        yield user.save();
    } catch (err) {
        return next(err);
    }
    next();
});

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  const redirectTo = req.session.returnTo
    ? req.session.returnTo
    : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}

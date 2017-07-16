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
 *  Show profile
 */

exports.show = function (req, res) {
  const user = req.profile;
  respond(res, 'users/show', {
    title: user.name,
    user: user
  });
};

exports.signin = function (req, res) {
    res.json({
       status: 'signin'
    });
};

/**
 * Auth callback
 */

exports.authCallback = login;


exports.removeSpot = async(function* (req, res, next) {
    try {
        yield User.removeFavourite(req.user.id, _.parseInt(req.params.id));
    } catch (err) {
        return next(err);
    }
    res.json({
        isSuccessful: true
    });
});

exports.addSpot = async(function* (req, res, next) {
    const userId = req.user.id;
    try {
        const spot = yield Spot.findOne({
            _id: _.parseInt(req.params.id)
        });
        if (!spot) {
            return next(new Error('Spot not found'));
        }


        if (_.includes(req.user.preferenses.favouriteSpots, spot._id)) {
            console.log('Already added');
            res.json({
                isSuccessful: true
            });
            return;
        }


        yield User.addFavourite(userId, spot._id);
    } catch (err) {
        return next(err);
    }
    res.json({
        isSuccessful: true
    });
});

/**
 * Show sign up form
 */
/*
exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
}; */

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  const redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}

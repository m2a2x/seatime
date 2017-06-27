'use strict';

/**
 * Expose
 */

module.exports = {
  db: process.env.MONGODB_URI,
  facebook: {
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://seatime.herokuapp.com/auth/facebook/callback'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://seatime.herokuapp.com/auth/google/callback'
  },
  mswd: {
      clientID: process.env.MSWS_CLIENTID
  }
};

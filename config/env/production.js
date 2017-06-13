'use strict';

/**
 * Expose
 */

module.exports = {
  db: process.env.MONGOHQ_URL,
  facebook: {
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://nodejs-express-demo.herokuapp.com/auth/facebook/callback'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://nodejs-express-demo.herokuapp.com/auth/google/callback'
  }
};

'use strict';

/**
 * Expose
 */

module.exports = {
    db: 'mongodb://localhost/seatime',
    facebook: {
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    google: {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    mswd: {
        clientID: process.env.MSWS_CLIENTID
    }
};

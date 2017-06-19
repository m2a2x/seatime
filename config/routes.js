'use strict';
const users = require('../app/controllers/users');
const spots = require('../app/controllers/spots');
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

module.exports = function (app, api, passport) {
    const pauth = passport.authenticate.bind(passport);

    /**
     * Crawler, don't use without purpose
     */
    app.get('/crawler', auth.requiresLogin, crawler.get);

    /**
     * DB fill
     */
    app.get('/test', builder.test);

    /**
     * Local Auth
     */
    app.post('/users/session',
        pauth('local', {
            failureRedirect: fail.failureRedirect,
            failureFlash: 'Invalid email or password.'
        }), users.session);

    /**
     * Facebook
     */
    app.get('/auth/facebook',
        pauth('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: fail.failureRedirect
        }), users.signin
    );
    app.get('/auth/facebook/callback', pauth('facebook', fail), users.authCallback);


    /**
     * Google
     */
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

    /**
     * Logout
     */
    app.get('/logout', users.session);

    /**
     * Api call
     */

    api.param('userId', users.load);

    api.get('/users/:userId', users.show);

    api.get('/user', users.getCurrent);

    api.get('/spots', spots.index);

    api.get('/spots/:id', spots.show);

    api.post('/user/spots/:id', auth.requiresLogin, users.addSpot);

    api.delete('/user/spots/:id', auth.requiresLogin, users.removeSpot);
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

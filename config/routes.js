'use strict';

/*
 * Module dependencies.
 */

const users = require('../app/controllers/users');
const spots = require('../app/controllers/spots');
const crawler = require('../app/controllers/crawler');
const builder = require('../app/controllers/builder');
const auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];

const fail = {
  failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app, api, passport) {
    const pauth = passport.authenticate.bind(passport);

    // user routes
    /*app.get('/login', users.login);
   app.get('/signup', users.signup);
   app.post('/users', users.create);*/

    // crawler
    app.get('/crawler', crawler.get);

    // fill db
    app.get('/test', builder.test);

    app.post('/users/session',
        pauth('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session);

    app.get('/auth/facebook',
        pauth('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/login'
        }),
        users.signin
    );
    app.get('/auth/facebook/callback',
        pauth('facebook', fail),
        users.authCallback);

    app.get('/logout', users.logout);



    // API
    api.get('/users/:userId', users.show);
    api.param('userId', users.load);

    api.get('/user', users.getCurrent);

    api.get('/spots', spots.index);
    // spots
    api.get('/spots/:id', spots.show);

    api.post('/user/spots/:id', auth.requiresLogin, users.addSpot);
    api.delete('/user/spots/:id', articleAuth, users.removeSpot);
};







  /*

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
   app.param('id', articles.load);
 app.get('/articles', articles.index);
 app.get('/articles/new', auth.requiresLogin, articles.new);
 app.post('/articles', auth.requiresLogin, articles.create);
 app.get('/articles/:id', articles.show);

 app.get('/articles/:id/edit', articleAuth, articles.edit);
 app.put('/articles/:id', articleAuth, articles.update);
 app.delete('/articles/:id', articleAuth, articles.destroy);

*/

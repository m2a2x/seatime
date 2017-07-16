'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const session = require('express-session');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const path = require('path');
const csrf = require('csurf');

const mongoStore = require('connect-mongo')(session);
const winston = require('winston');
const helpers = require('view-helpers');
const config = require('./');
const pkg = require('../package.json');
const env = process.env.NODE_ENV || 'development';


/**
 * Expose
 */

module.exports = function (app, passport) {

    // Compression middleware (should be placed before express.static)
    app.use(compression({
        threshold: 512
    }));

    app.use(cors({
        origin: ['http://localhost:3000'],
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true
    }));

    // Static files middleware
    app.use(express.static(path.join(config.root, '/client')));

    // Use winston on production
    let log = 'dev';
    if (env !== 'development') {
        log = {
            stream: {
                write: message => winston.info(message)
            }
        };
    }

    // Don't log during tests
    // Logging middleware
    app.use(morgan(log));


    // expose package.json to views
    app.use(function (req, res, next) {
        res.locals.pkg = pkg;
        res.locals.env = env;
        next();
    });

    // bodyParser should be above methodOverride
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));


    app.use(methodOverride(function (req) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    // create api router
    var api = new express.Router();
    var apiDevice = new express.Router();


    // CookieParser should be above session
    app.use(cookieParser());
    app.use(cookieSession({secret: 'secret'}));
    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: pkg.name,
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));



    // api.use(csrf({ cookie: {key: 'x-xsrf-token', path: '/'}}));
    app.use(csrf({}));

    // This could be moved to view-helpers :-)
    app.use(function (req, res, next) {
        if (req.csrfToken) {
            res.cookie('XSRF-TOKEN', req.csrfToken());
        }
        next();
    });

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // should be declared after session
    app.use(helpers(pkg.name));
    app.use('/api', api);
    app.use('/apiDevice', apiDevice);

    require(path.join(config.root, '/config/routes'))(app, api, apiDevice, passport);

    app.use('/node_modules', express.static(path.join(config.root, '/node_modules')));
    app.use(function (req, res) {
        // Use res.sendfile, as it streams instead of reading the file into memory.
        res.sendFile(path.join(config.root, '/client/index.html'));
    });

    if (env === 'development') {
        app.locals.pretty = true;
    }
};

'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
/**
 * User Schema
 */

const UserSchema = new Schema({
    name: {type: String, default: ''},
    email: {type: String, default: ''},
    username: {type: String, default: ''},
    hashed_password: {type: String, default: ''},
    salt: {type: String, default: ''},
    authToken: {type: String, default: ''},
    admin: {type: Boolean, default: false},
    preferenses: {
        favouriteSpots: [{type: Number, ref: 'Spot'}],
        devices: [{
            _id: {type: String, required: true},
            name: {type: String, default: ''}
        }]
    },
    provider: {
        facebook: {},
        google: {}
    },
    apiKey: {type: String, default: ''}
});

const validatePresenceOf = value => value && value.length;

/**
 * Virtuals
 */

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

/**
 * Validations
 */

// the below validations only apply if you are signing up traditionally

UserSchema.path('email').validate(function (email) {
    if (this.skipValidation()) return true;
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
    const User = mongoose.model('User');
    if (this.skipValidation()) fn(true);

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        User.find({email: email}).exec(function (err, users) {
            fn(!err && users.length === 0);
        });
    } else fn(true);
}, 'Email already exists');

UserSchema.path('hashed_password').validate(function (hashed_password) {
    if (this.skipValidation()) return true;
    return hashed_password.length && this._password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && !this.skipValidation()) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});

/**
 * Methods
 */

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    /**
     * Validation is not required if using OAuth
     */

    skipValidation: function () {
        return !!this.provider;
    }
};

/**
 * Statics
 */

UserSchema.statics = {

    /**
     * Load
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function (options, cb) {
        options.select = options.select || 'name preferenses';
        return this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
    },

    loginUser: function (provider, profile, email, done) {
        const doc = this;
        const providerPath = 'provider.' + provider;
        var criteria = {};
        var prom;

        criteria[providerPath + '.id'] = profile.id;

        prom = doc.findOne(criteria).exec();
        prom.then(function(user) {
                if (!user) {
                    return doc.findOne({email: email}).exec();
                }
                done(null, user);
                throw new Error();
            }, function(err) {
                done(err);
            })
            .then(function(user) {
                if (!user) {
                    var providerData = {};
                    providerData[provider] = profile._json;
                    user = new doc({
                        name: profile.displayName,
                        email: email,
                        username: profile.username,
                        provider: providerData
                    });
                } else {
                    user.provider[provider] = profile._json;
                }

                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    return done(err, user);
                });
            })
            .catch(function () {
                console.log("Promise Rejected");
            });
    },

    addFavourite: function (userId, spotId) {
        return this.update({_id: userId}, {
            $push: {
                'preferenses.favouriteSpots': spotId
            }
        });
    },

    removeFavourite: function (userId, spotId) {
        return this.update({_id: userId}, {
                $pull: {
                    'preferenses.favouriteSpots': spotId
                }
            },
            {safe: true, multi: true});
    },

    addDevice: function (userId, deviceId, deviceName) {
        return this.update({_id: userId}, {
            $push: {
                'preferenses.devices': {
                    _id: deviceId,
                    name: deviceName
                }
            }
        });
    }
};

mongoose.model('User', UserSchema);

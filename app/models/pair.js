'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { wrap: async } = require('co');

const pairTime = 60; //seconds

/**
 * Pair Schema
 */

const PairSchema = new Schema({
    _id: { type: Number, required: true },
    uuid: { type: String, required: true },
    device: { type: String, default: ''},
    createdAt: { type : Date, default : Date.now, expires : pairTime },
    time: { type: Number, default : pairTime}
});

/**
 * Statics
 */

PairSchema.statics = {
    setPair: async(function* (uuid, device) {
        var pair,
            doc,
            code;

        doc = this;


        pair = yield doc.findOne({
            uuid: uuid
        });

        if (pair) {
            return pair;
        }

        code = yield this.getUniq();

        pair = new doc({
            _id: code,
            uuid: uuid,
            device: device || ''
        });

        return pair.save();
    }),
    getPair: async(function* (id) {
        return this.findOne({
            _id: id
        }).exec();
    }),
    getUniq: async(function* () {
        const rand = Math.floor(Math.random() * 9000) + 1000;
        const pair = yield this.findOne({
            _id: rand
        });
        if (pair) {
            return this.getUniq();
        }
        return rand;
    })
};


mongoose.model('Pair', PairSchema);
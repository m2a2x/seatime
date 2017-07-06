'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 */

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

/**
 * Statics
 */

CounterSchema.statics = {
  getIncreament: function (id) {
    var doc = this;
    return doc.findById({_id: id})
        .then(function (counter) {
            if (counter) {
              return counter.seq;
            } else {
              return doc.findByIdAndUpdate({_id: id}, {$inc: { seq: 1} }, {new: true, upsert: true})
                .then(function(counter) {
                   return counter.seq;
                });
            }
        });
  },
  setIncreament: function (id, seq) {
      var doc = this;
      return doc.findById({_id: id})
          .then(function (counter) {
              if (counter && counter.seq < seq) {
                  return doc.findByIdAndUpdate({_id: id}, {seq: seq})
                      .then(function(counter) {
                          return counter.seq;
                      });
              } else {
                  return counter.seq;
              }
          });
  },
  getUpdated: function (id) {
    var doc = this;
    return doc.findByIdAndUpdate({_id: id}, {$inc: { seq: 1} }, {new: true, upsert: true})
        .then(function(counter) {
            return counter.seq;
        });
  },

};


mongoose.model('Counter', CounterSchema);
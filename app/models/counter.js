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
  _id: {type: String, required: true},
  seq: { type: Number, default: 0 }
});

/**
 * Statics
 */

CounterSchema.statics = {
  getIncreament: function () {
    var doc = this;
    return doc.findById({_id: 'entityId'})
        .then(function (counter) {
            if (counter) {
              return counter.seq;
            } else {
              return doc.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, {new: true, upsert: true})
                .then(function(counter) {
                   return counter.seq;
                });
            }
        });
  },
  setIncreament: function (id) {
      var doc = this;
      return doc.findById({_id: 'entityId'})
          .then(function (counter) {
              if (counter && counter.seq < id) {
                  return doc.findByIdAndUpdate({_id: 'entityId'}, {seq: id})
                      .then(function(counter) {
                          return counter.seq;
                      });
              } else {
                  return counter.seq;
              }
          });
  }
};


mongoose.model('Counter', CounterSchema);
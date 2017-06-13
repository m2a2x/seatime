'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Continent Schema
 */

const ContinentSchema = new Schema({
  _id: { type : Number, default : 0},
  name: { type : String, default : '', trim : true },
  meta: {
    mswd: {
      id: Number
    },
    createdAt  : { type : Date, default : Date.now }
  }
});

mongoose.model('Continent', ContinentSchema);

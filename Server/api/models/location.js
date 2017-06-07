'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LocationSchema = new Schema({
  name: {
    type: String,
    Required: 'Please provide a name',
    index: true
  },
  ssid: {
    type: String,
    Required: "Please provide ssid"
  },
  password: {
    type: String,
    Required: "Please provide password"
  },
  latitude: {
    type: Number,
    Required: "Please provide latitude"
  },
  longitude: {
    type: Number,
    Required: "Please provide longitude"
  }
});

module.exports = mongoose.model('Location', LocationSchema);

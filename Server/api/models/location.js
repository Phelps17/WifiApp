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
  },
  connections: [ {
    date : {type: String, index : true},
    returning: {type: Number, default: 0},
    new: {type:Number, default: 0}
  }]
});

module.exports = mongoose.model('Location', LocationSchema);

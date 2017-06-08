'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  ssid: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  devices: [ {
    ip: { type:String , required:true },
    mac: { type:String, index: true, required: true}
  }],
  connections: [ {
    date : {type: String, index : true, required: true},
    returning: {type: Number, default: 0},
    new: {type:Number, default: 0}
  }]
});

module.exports = mongoose.model('Location', LocationSchema);

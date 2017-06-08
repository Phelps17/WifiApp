'use strict';


var mongoose = require('mongoose'),
  Location = mongoose.model('Location');


exports.create_location = function(req, res) {
  var new_location = new Location(req.body);
  new_location.save(function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};

exports.locations = function(req, res) {
  Location.find({}, function(err, locations) {
    if (err)
      res.send(err);
    res.json(locations);
  })
}


exports.find_location = function(req, res) {
  var query = {};
  query['latitude'] = req.body.latitude;
  query['longitude'] = req.body.longitude;
  Location.findOne(query, function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};


exports.update_location = function(req, res) {
  Location.findOneAndUpdate({latitude: req.body.latitude, longitude: req.body.longitude}, req.body, {new: true}, function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};

exports.connections = function(req, res) {
  var query = {};
  query['latitude'] = req.body.latitude;
  query['longitude'] = req.body.longitude;
  Location.findOne(query, function(err, location) {
    if (err)
      res.send(err);
    //var jsonObj = JSON.parse(location);
    var day = new Date().toISOString().split('T')[0];
    var done = false;
    for (var i = 0; i < location['connections'].length; i++) {

      if(location['connections'][i]['date'] === day) {
        done = true;
        if(req.body.code == 0)
          location['connections'][i]['returning']++;
        else {
          location['connections'][i]['new']++;
        }
      }
    }
    if(!done) {
      location['connections'].push({returning: req.body.code, date: day});
    }
    Location.findOneAndUpdate(query, location, {new: true}, function(err, location) {
      if (err)
        res.send(err);
      res.json(location);
    });
  });
};

exports.metrics = function(req, res) {
  var query = {};
  query['latitude'] = req.body.latitude;
  query['longitude'] = req.body.longitude;
  Location.findOne(query, function(err, location) {
    if (err) {
      res.send(err);
    }
    res.json(location['connections']);
  });
};


exports.delete_location = function(req, res) {
  var query = {};
  query['latitude'] = req.body.latitude;
  query['longitude'] = req.body.longitude;
  Location.findOne(query, function(err, location) {
    if (err) {
      res.send(err);
    }
    else{
      if(location != null) {
        Location.remove({latitude: req.body.latitude, longitude: req.body.longitude}, function(err, location) {
          if (err){
            res.send(err);
          }
          res.json({ message: 'Location successfully deleted' });
        });
      }
      else {
        res.json({message: 'Location does not exist'});
      }
    }
  });
};

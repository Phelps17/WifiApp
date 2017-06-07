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
  query['latitude'] = req.query.latitude;
  query['longitude'] = req.query.longitude;
  Location.findOne(query, function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};


exports.update_location = function(req, res) {
  Location.findOneAndUpdate({latitude: req.query.latitude, longitude: req.query.longitude}, req.body, {new: true}, function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};


exports.delete_location = function(req, res) {
  var query = {};
  query['latitude'] = req.query.latitude;
  query['longitude'] = req.query.longitude;
  Location.findOne(query, function(err, location) {
    if (err) {
      res.send(err);
    }
    else{
      if(location != null) {
        Location.remove({latitude: req.query.latitude, longitude: req.query.longitude}, function(err, location) {
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
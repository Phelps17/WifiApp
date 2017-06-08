'use strict';


var mongoose = require('mongoose'),
  Location = mongoose.model('Location');


exports.create_location = function(req, res) {
  var new_location = new Location(req.body);
  new_location.latitude = Math.floor(new_location.latitude);
  new_location.longitude = Math.floor(new_location.longitude);
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
  query['latitude'] = Math.floor(req.body.latitude);
  query['longitude'] = Math.floor(req.body.longitude);
  Location.findOne(query, function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};


exports.update_location = function(req, res) {
  var body = req.body;
  body.latitude = Math.floor(req.body.latitude);
  body.longitude = Math.floor(req.body.longitude);
  Location.findOneAndUpdate({latitude: Math.floor(req.body.latitude), longitude: Math.floor(req.body.longitude)}, req.body, {new: true}, function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};

exports.connections = function(req, res) {
  var query = {};
  query['latitude'] = Math.floor(req.body.latitude);
  query['longitude'] = Math.floor(req.body.longitude);
  Location.findOne(query, function(err, location) {
    if (err)
      res.send(err);
    //var jsonObj = JSON.parse(location);
    var day = new Date().toISOString().split('T')[0];
    var done = false;
    for (var i = 0; i < location['connections'].length; i++) {

      if(location['connections'][i]['date'] === day) {
        done = true;
        if(req.body.code === 0)
          location['connections'][i]['returning']++;
        else{
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

exports.device_info = function(req, res) {
  var query = {};
  query['latitude'] = Math.floor(req.body.latitude);
  query['longitude'] = Math.floor(req.body.longitude);
  Location.findOne(query, function(err, location) {
    if (err) {
      res.send(err);
    }
    var found = false;
    var i = 0;
    for (i ; i < location['devices'].length; i++) {
        if(location['devices'][i]['mac'] === req.body.mac) {
          found = true;
          break;
        }
    }
    if(found) {
      location['devices'][i]['ip'] = req.body.ip;
    }
    else {
      location['devices'].push({ip: req.body.ip, mac: req.body.mac});
    }
    Location.findOneAndUpdate(query, location, {new: true}, function(err, location){
      if (err)
        res.send(err);
      res.json({});
    })
  });

}

exports.devices = function(req, res) {
  var query = {};
  query['latitude'] = Math.floor(req.body.latitude);
  query['longitude'] = Math.floor(req.body.longitude);
  Location.findOne(query, function(err, location) {
    if (err) {
      res.send(err);
    }
    res.json(location['devices']);
  });
}

exports.metrics = function(req, res) {
  var query = {};
  query['latitude'] = Math.floor(req.body.latitude);
  query['longitude'] = Math.floor(req.body.longitude);
  Location.findOne(query, function(err, location) {
    if (err) {
      res.send(err);
    }
    res.json(location['connections']);
  });
};


exports.delete_location = function(req, res) {
  var query = {};
  query['latitude'] = Math.floor(req.body.latitude);
  query['longitude'] = Math.floor(req.body.longitude);
  Location.findOne(query, function(err, location) {
    if (err) {
      res.send(err);
    }
    else{
      if(location != null) {
        Location.remove({latitude: Math.floor(req.body.latitude), longitude: Math.floor(req.body.longitude)}, function(err, location) {
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

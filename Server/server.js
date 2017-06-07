var express = require('express'),
  app = express(),
  port = process.env.PORT || 4000,
  mongoose = require('mongoose'),
  Location = require('./api/models/location'),
  bodyParser = require('body-parser');
  cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sampledb');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/route');
routes(app);


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);

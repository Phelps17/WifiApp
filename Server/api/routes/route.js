'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/controller');


  // todoList Routes
  app.route('/location')
    .post(todoList.find_location);
  
  app.route('/location/create')
    .post(todoList.create_location);

  app.route('/locations')
    .get(todoList.locations);

  app.route('/location/delete')
    .delete(todoList.delete_location);

  app.route('/location/update')
    .put(todoList.update_location);
};

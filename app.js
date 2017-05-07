var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');

// TASK change all wrong 404 errors to 500
// TASK create 200 answer handler
// TASK create normal ObjectId type with refs in schemas (make relationship)
// INFO about that you can find by googling mongoose queryes

mongoose.connect(config.mongo_connection_string);

//контроллеры
var authController = require('./controllers/auth');

var userObject;

//роутеры
var routes = require('./routes/index');
var users = require('./routes/users');
var messages = require('./routes/messages');
var chats = require('./routes/chats');
var ask_token = require('./routes/ask_token');
var contacts = require('./routes/contacts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// use custom ways
app.use('/', routes);
app.use('/users', users);
app.use('/ask_token', ask_token);
app.use('/messages', messages);
app.use('/chats', chats);
app.use('/contacts', contacts);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  console.log(err.stack);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({status: "error"});
});

module.exports = app;

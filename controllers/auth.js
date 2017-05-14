/* Контроллер, отвечающий за проверку токенов и выдачу прав */

var express = require('express');
var UserModel = require('../models/users');
var JWT = require('../cryptography/jwt');

var isAuth = function(req, res, next){
  var raw_jwt = req.get('jwt');

  if(!raw_jwt){
    res.status(401);
    res.send({status: 'error', message: 'not authorize'});
  }
  else {
    var jwt = JWT.read_JWT(raw_jwt);
    var _id = jwt.id;
    var token = jwt.token;

    UserModel.findById(_id, function(err, user){
      if(err){
        //TODO error handler
      }
      else {
        var test_jwt = JWT.create_JWT(user);
        if(!(raw_jwt === test_jwt)){
          res.status(401);
          res.send({status:'error', message:'not authorize'});
        }
        else{
          res.locals.user = user;
          return next();
        }
      }
    });
  }
}

module.exports = isAuth;

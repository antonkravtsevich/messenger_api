var express = require('express');
var router = express.Router();
var sha1 = require('../cryptography/sha1')
var UserModel = require('../models/users');

/*POST user page*/
router.post('/', function(req, res) {
  var user = new UserModel({
    username: req.body.username,
    password: sha1(req.body.password),
    personal_data:{
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    }
  });

  user.save(function(err){
    if (err) {
      if(err.code == 11000){
        //Ошибка валидации новой записи, не уникальный username
        res.status(404);
        res.send({status: 'error', message: 'this username already exist'});
      }
      else {
        res.status(404);
        res.send({status: 'error', message: err});
      }
    }
    else {
      res.status(200);
      res.send({status: 'ok', message: 'user added'});
    }
  });
});

router.get('/', function(req, res){
  UserModel.find(function(err, users) {
    if (err){
      res.status(404);
      res.send({status: 'error', message: err});
    }
    else{
      res.status(200);
      res.send({status: 'ok', message: users.map(function(user){
        return {
          username: user.username,
          _id: user._id
        };
      })});
    }
  });
})

router.get('/:id', function(req, res){
  UserModel.findById(req.params.id, function(err, user){
    if(err){
      //TODO error handler
    }
    else{
      res.status(200);
      res.send({status:'ok', message: user});
    }
  })
})

module.exports = router;

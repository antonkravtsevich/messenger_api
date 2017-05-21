var express = require('express');
var router = express.Router();
var sha1 = require('../cryptography/sha1');
var isAuth = require('../controllers/auth');
var UserModel = require('../models/users');
var ChatModel = require('../models/chats');
var MessageModel = require('../models/messages');

/*POST user page*/
router.post('/', (req, res)=>{
  var user = new UserModel({
    username: req.body.username,
    password: sha1(req.body.password),
    personal_data:{
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    }
  });

  user.save((err)=>{
    if (err) {
      if(err.code == 11000){
        //Validation error, not unique username
        res.status(404);
        res.send({status: 'error', message: 'This username is already taken.'});
      }
      else {
        res.status(404);
        res.send({status: 'error', message: err});
      }
    }
    else {
      res.status(200);
      res.send({status: 'ok', message: 'Registration completed successfully'});
    }
  });
});

router.put('/', isAuth, (req, res) => {
  user = res.locals.user;
  var new_pd={
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  };
  UserModel.update(
    {username: user.username},
    {$set:{personal_data: new_pd}},
    function (err) {
      if(err){
        res.status(404);
        res.send({status: 'error', message: err});
      } else {
        res.status(200);
        res.send({status: 'ok', message: 'Updating finished succesfully'});
      }
    }
  )
})

router.delete('/', isAuth, (req, res) => {
  var user = res.locals.user;
  ChatModel.find({users: user._id}, (err, chats) => {
    chats.forEach((chat) => {
      MessageModel.find({_id:{
        $in: chat.messages.map((id)=>{return mongoose.Types.ObjectId(id); })
      }}).remove().exec();
    })
  });
  ChatModel.find({users: user._id}).remove().exec();
  UserModel.findById(user._id).remove((err) => {
    if(err){
      devErrHandler(500, err);
    }else{
      res.status(200);
      res.send({status: 'ok', message: 'Deleting successfull'});
    }
  })
})

router.get('/', (req, res)=>{

  UserModel.find((err, users)=>{
    if (err){
      res.status(404);
      res.send({status: 'error', message: err});
    }
    else{
      res.status(200);
      res.send({status: 'ok', message: users.map((user)=>{
        return {
          username: user.username,
          _id: user._id,
          personal_data: user.personal_data
        };
      })});
    }
  });
})

router.get('/data', isAuth, (req, res) => {
  user = res.locals.user;
  res.send({status: 'ok',
    message: {
      _id: user._id,
      username: user.username,
      personal_data: user.personal_data
    }
  });
});

router.get('/:id', function(req, res){
  UserModel.findById(req.params.id, (err, user)=>{
    if(err){
      //TODO error handler
    }
    else{
      res.status(200);
      res.send({status:'ok', message: {
        _id: user._id,
        username: user.username,
        personal_data: user.personal_data
      }});
    }
  })
})

module.exports = router;

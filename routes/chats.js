// chat router, provides chats/messages info for current user

// node modules
var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var router = express.Router();

// custom controllers
var devErrHandler = require('../controllers/develop_error_handler');
var isAuth = require('../controllers/auth');

Promise.promisifyAll(mongoose);

// custom models
var ChatModel = require('../models/chats');
var MessageModel = require('../models/messages');

function messagesQuery(ids){
  var query = MessageModel.find({_id:{
    $in: ids.map(function(id){return mongoose.Types.ObjectId(id); })
  }});
  return query;
}

function getAllMessagesFromOneChat(ids){
  return map(messagesQuery(ids).exec())
}

router.get('/', isAuth, function(req, res){
  ChatModel.find({users: res.locals.user._id}, function(err, chats){
    if(err) devErrHandler(500, err);
    else {
      res.status(200);
      res.send({
        status: 'ok',
        //get only necessary fields
        message: chats.map(function(chat){
          return{
            _id: chat.id,
            users: chat.users,
            date: chat.last_date
          };
        })
      });
    }
  })
});

// TODO create pagination
router.get('/:chat_id', isAuth, function(req, res){
  ChatModel.findById(req.params.chat_id, function(err, chat){
    if(!chat){
      res.status(404);
      res.send({status: 'error', message: 'wrong query'});
    }
    else{
      console.log(chat.users);
      console.log(res.locals.user._id);
      if(chat.users.indexOf(res.locals.user._id) == -1){
        res.status(401);
        res.send({status: 'error', message: 'access denied'});
      }
      else{
        if(err) devErrHandler(500, err);
        else{
          // chat.message contain an array of message ids
          // with below method we get messages with ids that chat.message contained
          MessageModel.find({_id:{
            $in: chat.messages.map(function(id){return mongoose.Types.ObjectId(id); })
          }}, function(err, messages){
            if(err) devErrHandler(500, err);
            else{
              res.status(200);
              res.send({
                status: 'ok',
                // get only necessary fields
                message: messages.map(function(message){
                  return{
                    _id: message._id,
                    text: message.text,
                    date: message.date
                  }
                })
              });
            }
          });
        }
      }
    }
  })
})

module.exports = router;

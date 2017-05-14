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
    $in: ids.map((id)=>{return mongoose.Types.ObjectId(id); })
  }});
  return query;
}

function getRightId(id_mass, id){
  if(id_mass[0]==id) return id_mass[1];
  else return id_mass[0];
}

router.get('/', isAuth, (req, res)=>{
  ChatModel.find({users: res.locals.user._id}, (err, chats)=>{
    if(err) devErrHandler(500, err);
    else {
      res.status(200);
      res.send({
        status: 'ok',
        //get only necessary fields
        message: chats.map((chat)=>{
          //DEBUG
          //console.log('___________________');
          //console.log('mass: '+chat.users);
          //console.log('current: '+res.locals.user._id);
          //console.log('right: '+getRightId(chat.users, res.locals.user._id));
          return{
            _id: chat.id,
            companion_id: getRightId(chat.users, res.locals.user._id),
            date: chat.last_date
          };
        })
      });
    }
  })
});

router.get('/by_users/:user_id', isAuth, (req, res)=>{
  //console.log('req.params.user_id: '+req.params.user_id);
  //console.log('res.locals.user._id: '+res.locals.user._id);
  if(req.params.user_id !== res.locals.user._id){
    ChatModel.findOne({users: {$all: [req.params.user_id, res.locals.user._id]}}, (err, chat)=>{
      if(!chat){
        //console.log('chat not found');
        new_chat = new ChatModel({
          users: [req.params.user_id, res.locals.user._id]
        });
        new_chat.save((err)=>{if(err) devErrHandler(500, err)});
        res.status(200);
        res.send({status: 'ok', message: new_chat._id});
      } else {
        //console.log('chat already exist');
        //console.log(JSON.stringify(chat));
        res.status(200);
        res.send({status: 'ok', message: chat._id});
      }
    })
  }
})

// TODO create pagination
router.get('/:chat_id', isAuth, (req, res)=>{
  //console.log('get chat by id');
  ChatModel.findById(req.params.chat_id, (err, chat)=>{
    if(!chat){
      res.status(404);
      res.send({status: 'error', message: 'wrong query'});
    }
    else{

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
            $in: chat.messages.map((id)=>{return mongoose.Types.ObjectId(id); })
          }}, function(err, messages){
            if(err) devErrHandler(500, err);
            else{
              res.status(200);
              res.send({
                status: 'ok',
                // get only neccesery fields
                message: messages.map((message)=>{
                  return{
                    _id: message._id,
                    text: message.text,
                    date: message.date,
                    sender_id: message.sender_id
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

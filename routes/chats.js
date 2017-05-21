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
var UserModel = require('../models/users');

/*
function getRightId(id_mass, id){
  if(id_mass[0]==id) return id_mass[1];
  else return id_mass[0];
}
*/

function getChatById(res, chat_id, current_user){
  ChatModel.findById(chat_id)
    .populate('users', '_id username personal_data', {_id: {'$ne': current_user._id}})
    .populate('messages', '_id text date sender_id')
    .exec((err, result) => {
      if(err) devErrHandler(500, err);
      else {
        res.status(200);
        res.send({status: 'ok', message: result});
      }
    })
}

//all chats for current user
router.get('/', isAuth, (req, res) => {
  ChatModel.find({users: res.locals.user._id})
  .populate('users', '_id username personal_data', {_id: {'$ne': res.locals.user._id}})
  .populate('messages', '_id text date sender_id')
  .exec((err, result) => {
    res.status(200);
    res.send({status: 'ok', message: result})
  });
})

//get id of two users chat
router.get('/by_users/:user_id', isAuth, (req, res)=>{
  console.log('req.params.user_id: '+req.params.user_id);
  console.log('res.locals.user._id: '+res.locals.user._id);
  if(req.params.user_id != res.locals.user._id){
    console.log('users ids is not same');
    ChatModel.findOne({users: {$all: [req.params.user_id, res.locals.user._id]}}, (err, chat)=>{
      if(!chat){
        console.log('chat not found');
        UserModel.findById(req.params.user_id, (err, user) => {
          if(err) console.log('error: '+JSON.stringify(err, null, 2));
          console.log('user: '+JSON.stringify(user, null, 2));
          new_chat = new ChatModel();
          new_chat.users.push(res.locals.user);
          new_chat.users.push(user);
          new_chat.save((err)=>{
            if(err) devErrHandler(500, err);
            else {
              console.log('new chat created');
              getChatById(res, new_chat._id, res.locals.user);
            }
          });
        });
      } else {
        getChatById(res, chat._id, res.locals.user);
      }
    })
  }
})

//get all messages on chat_id
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
            getChatById(res, req.params.chat_id, res.locals.user);
        }
      }
    }
  })
})

module.exports = router;

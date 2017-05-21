/* роутер, отвечающий за отправку/получение сообщений */

var express = require('express');
var datetime = require('node-datetime');
var router = express.Router();

// custom models
var UserModel = require('../models/users');
var MessageModel = require('../models/messages');
var ChatModel = require('../models/chats');

// controllers
var devErrHandler = require('../controllers/develop_error_handler');
var isAuth = require('../controllers/auth');

// TODO check if user with reciever_id exist
// INFO sending message
// REFACTOR change collback hell to promises
router.post('/', isAuth, (req, res)=>{
  var sender_id = res.locals.user._id;
  var reciever_id = req.body.reciever;
  var date = datetime.create().format('Y.m.d.H.M.S.N');

  //console.log('req.body: '+JSON.stringify(req.body));
  //console.log('reciever_id: '+reciever_id);

  ChatModel.findOne({users: {$all: [sender_id, reciever_id]}}, (err, chat)=>{
    if(err) devErrHandler(500, err);
    else{
      var message = new MessageModel({
        text: req.body.text,
        date: date,
        sender_id: sender_id
      });
      message.save((err) => {
        if(err) devErrHandler(500, err);
      });

      if(chat){
        chat.messages.push(message);
        chat.last_date = date;
        chat.save((err) => {
          if(err) devErrHandler(500, err);
          else{
            res.status(200);
            res.send({status: 'ok', message: 'message sent'});
          }
        });
      } else {
        UserModel.findById(reciever_id, (err, user) => {
          chat = new ChatModel();
          chat.messages.push(message);
          chat.users.push(res.locals.user);
          console.log("USER: "+JSON.stringify(user));
          chat.users.push(user);
          chat.last_date = date;
          chat.save((err) => {
            if(err) devErrHandler(500, err);
            else{
              res.status(200);
              res.send({status: 'ok', message: 'message sent'});
            }
          })
        })
      }
    }
  })
})

//router.delete('/', isAuth, )

/*
ChatModel.findByIdAndUpdate(
  chat_id,
  {$pull: {'messages': msg._id}},
  {$set: {'date': date}},
  {safe: true, upset: true, new: true},
  (err)=>{
    if(err) devErrHandler(500, err);
    else{
      res.status(200);
      res.send({status: 'ok', message: 'message added'});
    }
  }
)*/

module.exports = router;

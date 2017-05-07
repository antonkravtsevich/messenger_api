/* роутер, отвечающий за отправку/получение сообщений */

var express = require('express');
var datetime = require('node-datetime');
var router = express.Router();

// custom models
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

  ChatModel.findOne({users: sender_id, users: reciever_id}, (err, chat)=>{
    if(err) devErrHandler(500, err);
    else{
      if(!chat){
        chat = new ChatModel({
          users: [sender_id, reciever_id]
        });

        chat.save((err)=>{if(err) devErrHandler(500, err)});
      }

      var message = new MessageModel({
        text: req.body.text,
        date: date,
        chat_id: chat._id
      });

      message.save((err, msg)=>{
        if(err) devErrHandler(500, err);
        else{
          chat.date = date;
          chat.messages.push(msg._id);
          chat.save((err)=>{
            if(err) devErrHandler(500, err);
            else{
              res.status(200);
              res.send({status: 'ok', message: 'message sent'});
            }
          })
        }
      })
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

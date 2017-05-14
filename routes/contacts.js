/* router that use for manipulate with contacts */

var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');

var devErrHandler = require('../controllers/develop_error_handler');
var isAuth = require('../controllers/auth');

router.get('/', isAuth, (req, res)=>{
  res.status(200);
  res.send({status:'ok', message: res.locals.user.contacts});
})

router.post('/', isAuth, (req, res)=>{
  UserModel.findByIdAndUpdate(
    res.locals.user._id,
    {$push: {'contacts': req.body.new_contact}},
    {safe: true, upset: true, new: true},
    (err, user)=>{
      if(err) devErrHandler(500, err);
      else{
        res.status(200);
        res.send({status: 'ok', message: 'contact added'});
      }
    }
  )
})

router.delete('/:contact', isAuth, (req, res)=>{
  UserModel.findByIdAndUpdate(
    res.locals.user._id,
    {$pull: {'contacts': req.params.contact}},
    {safe: true, upset: true, new: true},
    (err)=>{
      if(err) devErrHandler(500, err);
      else{
        res.status(200);
        res.send({status:'ok', message:'contact deleted'});
      }
    }
  )
})

module.exports = router;

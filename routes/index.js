var express = require('express');
var router = express.Router();
var isAuth = require('../controllers/auth');

/* GET home page. */
router.get('/', isAuth, function(req, res) {
  res.send({status: 'ok', user: res.locals.user});
});

module.exports = router;

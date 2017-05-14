var sha1 = require('./sha1');
var Users = require('../models/users');
var config = require('../config');

//create JSON web token for user
var create_JWT = (user)=>{
  var tempstr = user.password+user._id+config.secret_key;
  var sign = sha1(tempstr);
  var jwt_string = JSON.stringify({id: user._id, sign: sign});
  var jwt_base64_string = new Buffer(jwt_string).toString('base64');
  return(jwt_base64_string);
}

var read_JWT = (jwt_base64)=>{
  var jwt_ascii = new Buffer(jwt_base64, 'base64').toString('ascii');
  return JSON.parse(jwt_ascii);
}

module.exports.create_JWT = create_JWT;
module.exports.read_JWT = read_JWT;

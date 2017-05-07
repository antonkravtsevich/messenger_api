var crypto = require('crypto');
var config = require('../config');

module.exports = function(input){
  return crypto.createHmac('sha256', config.secret_key).update(input).digest('base64');
}

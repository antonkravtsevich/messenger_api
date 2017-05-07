var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  text: {type: String, require: true},
  date: {type: String, require: true},
  chat_id: {type: String, require: true}
});

module.exports = mongoose.model('messages', MessageSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
  users: {type:[String], require: true},
  messages: {type: [String]},
  last_date: {type: String}
})

module.exports = mongoose.model('chats', ChatSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
  users: [{type:Schema.Types.ObjectId, ref:'users'}],
  messages: [{type:Schema.Types.ObjectId, ref:'messages'}],
  last_date: {type: String}
})

module.exports = mongoose.model('chats', ChatSchema);

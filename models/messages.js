var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  text: {type: String, require: true},
  date: {type: String, require: true},
  sender_id: {type: Schema.Types.ObjectId, ref:'users'}
});

module.exports = mongoose.model('messages', MessageSchema);

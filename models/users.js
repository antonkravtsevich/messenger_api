var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  personal_data: {
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String, require: true}
  }
})

module.exports = mongoose.model('users', UserSchema);

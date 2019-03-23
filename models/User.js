var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var validateEmail = function (email) {
   var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   return re.test(email)
};

var UserSchema = new Schema({
   email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
   },
   name: {
      type: String
   },
   salt: {
      type: String
   },
   hash: {
      type: String
   }
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
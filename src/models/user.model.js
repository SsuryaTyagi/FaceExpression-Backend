const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true, 
    index: true,
  },
  avatar: {
    type: String,
  },
  username: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    unique: [true, "username is already exists"],
  },
  email: {
    type: String,
    required: [true, "email is required."],
    unique: [true, "email is already exists."],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    select: false,
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

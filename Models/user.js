const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalMongoose = require("passport-local-mongoose");

const userSchem = new Schema({
  email: {
    type: String,
    require: true,
  },
});

userSchem.plugin(passportlocalMongoose);

module.exports = mongoose.model("User", userSchem)

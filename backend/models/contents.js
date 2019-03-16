const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var utc = new Date();
utc.setHours( utc.getHours() + 9);
const ContentsSchema = new Schema({
  title: String,
  categories: Array,
  description: String,
  userLocation: String,
  imageUrl: String,
  createdAt : {type: Date, default: utc},
  views : {type:Number, default : 0},
  Participants: Array,
  });

module.exports = mongoose.model("Contents", ContentsSchema);
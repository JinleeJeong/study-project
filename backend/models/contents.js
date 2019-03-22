const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment'); 

var utc = new Date();
utc.setHours( utc.getHours() + 9);
const ContentsSchema = new Schema({
  title: String,
  categories: Array,
  description: String,
  userLocation: String,
  imageUrl: String,
  createdAt : { type: Date, default: Date.now },
  views : {type:Number, default : 0},
  leader: String,
  Participants: Array,
  latlng: Object,
});
autoIncrement.initialize(mongoose.connection);
ContentsSchema.plugin(autoIncrement.plugin, {model : 'Contents' , field : 'id' , startAt : 1 })

module.exports = mongoose.model("Contents", ContentsSchema);
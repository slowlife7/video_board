const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
  ino: Number,
  title: String,
  path: String,
  created: Date,
  modified: Date
});
module.exports = mongoose.model('videoList', videoSchema);
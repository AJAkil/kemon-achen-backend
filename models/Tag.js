const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  title: String,
  description: String,
});

module.exports = mongoose.model("Tag", TagSchema);

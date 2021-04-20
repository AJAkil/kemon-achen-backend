const mongoose = require("mongoose");

const DiseaseSchema = new mongoose.Schema({
  title: String,
  description: String,
});

module.exports = mongoose.model("Disease", DiseaseSchema);

const mongoose = require("mongoose");

const Community = mongoose.model(
  "Community",
  new mongoose.Schema({
    name: String,
    isPrivate: Boolean,
    description: String,
    image: String,
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tag",
      },
    ],
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  })
);

module.exports = Community;

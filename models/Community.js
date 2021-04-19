const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
  name: String,
  isPrivate: Boolean,
  description: String,
  image: {
    type: String,
    default: "no-photo.jpg",
  },
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
});

module.exports = mongoose.model("Community", CommunitySchema);

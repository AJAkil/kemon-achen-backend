const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema(
  {
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
        ref: "Disease",
      },
    ],
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse Populate with virtuals
CommunitySchema.virtual("post", {
  ref: "Post",
  localField: "_id",
  foreignField: "community",
  justOne: false,
});

module.exports = mongoose.model("Community", CommunitySchema);

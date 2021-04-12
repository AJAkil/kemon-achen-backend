const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema(
    {
      title: String,
      content: String,
      postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      asPseudo: Boolean,
      tags: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Tag",
        },
      ],
      voteCount: Number,
      comments: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Comment",
        },
      ],
      community: {
        type: mongoose.Schema.ObjectId,
        ref: "Community",
      },
    },
    { timestamps: true }
  )
);

module.exports = Post;

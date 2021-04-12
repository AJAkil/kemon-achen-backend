const mongoose = require("mongoose");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema(
    {
      content: String,
      postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
      },
      asPseudo: Boolean,
      voteCount: Number,
      replies: [{
        type: mongoose.Schema.ObjectId,
        ref: "Comment"
      }]
    },
    { timestamps: true }
  )
);

module.exports = Comment;

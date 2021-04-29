const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: String,
    repliedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    parentPost:{
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true
    },
    asPseudo: { type: Boolean, default: false },
    voteCount: Number,
    replies: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true },
);



module.exports = mongoose.model("Comment", CommentSchema);

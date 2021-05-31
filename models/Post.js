const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    isLikedByCurrentUser: {
      type: Boolean,
      default: false,
    },
    likedByUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    asPseudo: { type: Boolean, default: false },
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Disease',
      },
    ],
    voteCount: Number,
    commentCount: Number,
    // comments: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Comment",
    //   },
    // ],
    community: {
      type: mongoose.Schema.ObjectId,
      ref: 'Community',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', PostSchema);

const mongoose = require('mongoose');
const { paginate } = require('../utils/pagination');

const PostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    // isLikedByCurrentUser: {
    //   type: Boolean,
    //   default: false,
    // },
    likedByUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        //default: [],
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
    postType: {
      type: String,
      enum: ['General', 'Q/A', 'Recommendations', 'Help'],
      default: 'General',
    },
    community: {
      type: mongoose.Schema.ObjectId,
      ref: 'Community',
    },
  },
  { timestamps: true },
);

PostSchema.plugin(paginate);
PostSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', PostSchema);

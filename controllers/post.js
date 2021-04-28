const User = require("../models/User");
const ProfessionalUser = require("../models/ProfessionalUser");
const RegularUser = require("../models/RegularUser");
const Disease = require("../models/Disease");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Community = require("../models/Community");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const mongoose = require("mongoose");
const {
  sendTokenResponse,
  getTimeDiff,
  removeItemOnce,
} = require("../utils/helperMethods");

// @desc     save a post by a logged in user
// @route    GET /api/v1/post/:postId/save
// @access   Private
exports.savePost = asyncHandler(async (req, res, next) => {
  let id = mongoose.Types.ObjectId(req.params.postId);
  let message;
  //console.log(typeof(id));

  // check to see if the user belongs to the certain community
  let post = await Post.find({
    _id: id,
  });

  console.log(post);

  //console.log(req.user);
  if (!post) {
    return next(
      new Error(`Post with id: ${req.user._id} is not on the database`, 400)
    );
  }

  if (req.query.saveOptions === "save") {
    await User.findByIdAndUpdate(req.user.id, { $push: { savedPosts: id } });

    message = "The Post has been saved!";
  } else {
    await User.findByIdAndUpdate(req.user.id, { $pull: { savedPosts: id } });

    message = "The Post has been unsaved!";
  }

  res.status(200).json({ data: message });
});

// @desc     like or unlike a post by a logged in user
// @route    GET /api/v1/post/:postId/like
// @access   Private
exports.likePost = asyncHandler(async (req, res, next) => {
  //console.log(typeof(req.params.communityId));

  let id = mongoose.Types.ObjectId(req.params.postId);

  let message = "";
  let counter = 1;

  // check to see if the user belongs to the certain community
  if (req.query.likeOptions === "like") {
    message = "The post has been liked!";
  } else {
    message = "The post has been unliked!";
    counter = -1;
  }

  const post = await Post.findByIdAndUpdate(
    id,
    { $inc: { voteCount: counter } },
    { new: true, upsert: true }
  );

  //console.log(post);

  //console.log(req.user);
  if (!post) {
    return next(
      new Error(`Post with id: ${req.user._id} is not on the database`, 400)
    );
  }

  res.status(200).json({ data: message });
});

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

// @desc     create a post by a logged in user
// @route    POST /api/v1/post/create
// @access   Private
exports.createPost = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  // finding the required community
  const community = await Community.find({
    name: req.body.community.name,
  }).select(["_id", "tags"]);
  //console.log(community.tags);

  // adding required fields
  req.body.postedBy = mongoose.Types.ObjectId(req.user.id);
  req.body.community = mongoose.Types.ObjectId(community[0]._id);
  req.body.tags = [community[0].tags[0]]; // setting the tag to the tag of the community

  const post = await Post.create(req.body);
  console.log(post);

  res.status(200).json({ data: "Your post has been created!" });
});

// @desc     create a comment of a post by a logged in user
// @route    POST /api/v1/post/:postId/comment/create
// @access   Private
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.postedBy = mongoose.Types.ObjectId(req.user.id);
  req.body.parentPost = mongoose.Types.ObjectId(req.params.postId);

  const comment = await Comment.create(req.body);
  //console.log(comment._id);

  //Querying the required data
  const commentResponse = await Comment.find(comment._id)
    .select(["_id", "content", "asPseudo", "voteCount", "createdAt"])
    .populate({
      path: "postedBy",
      select: "_id name image rank",
    })
    .lean();

  // editing the createdAt field
  commentResponse[0].createdAt = getTimeDiff(commentResponse[0].createdAt);

  //pushing the newly created comment in the post field
  await Post.findByIdAndUpdate(
    req.body.parentPost,
    { $push: { comments: commentResponse[0]._id } },
    { new: true, upsert: true }
  );

  //console.log(updatedPost);

  res.status(200).json({ data: commentResponse });
});

// @desc     create a reply of a comment by a logged in user
// @route    POST /post/:postId/comment/:commentId/reply/create
// @access   Private
exports.createReply = asyncHandler(async (req, res, next) => {



  res.status(200).json({ data: message });
});

const User = require('../models/User');
// const ProfessionalUser = require('../models/ProfessionalUser');
// const RegularUser = require('../models/RegularUser');
const Disease = require('../models/Disease');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Community = require('../models/Community');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const {
  getTimeDiff,
  getQueryOption,
  sortByProfessional,
  presentinTheArray,
} = require('../utils/helperMethods');

/**
 * @desc     save a post by a logged in user
 * @route    GET /api/v1/post/:postId/save
 * @access   Private
 */
exports.savePost = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.postId);
  let message;
  // sconsole.log(typeof(id));

  // check to see if the user belongs to the certain community
  const post = await Post.find({
    _id: id,
  });

  //console.log(post);

  // console.log(req.user);
  if (!post)
    return next(new Error(`Post with id: ${req.user._id} does not exist`, 400));

  if (req.query.saveOptions === 'save') {
    await User.findByIdAndUpdate(req.user.id, { $push: { savedPosts: id } });

    message = 'The Post has been saved!';
  } else {
    await User.findByIdAndUpdate(req.user.id, { $pull: { savedPosts: id } });

    message = 'The Post has been unsaved!';
  }

  res.status(200).json({ message: message });
});

/**
 * @desc  like or unlike a post by a logged in user
 * @route    GET /api/v1/post/:postId/like
 * @access   Private
 */
exports.likePost = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.postId);

  const userId = mongoose.Types.ObjectId(req.user.id);

  let message = '';
  let counter = 1;
  //let isLiked = false;

  const postedByUser = await Post.findById(id).select(['postedBy', 'title']);
  const notificationToBeSendUserId = postedByUser.postedBy;

  const currentUserInfo = await User.findById(userId).select('name');
  const currentUserName = currentUserInfo.name;

  const content = postedByUser.title;
  // console.log('current user ', postedByUser.title);
  // console.log('notified user ', currentUserName);

  let post = null;
  const user = await User.findById(notificationToBeSendUserId);

  if (req.query.likeOptions === 'like') {
    message = currentUserName + ' liked your post';
    //isLiked = true;
    post = await Post.findByIdAndUpdate(
      id,
      {
        //$set: { isLikedByCurrentUser: isLiked },
        $push: { likedByUsers: userId },
        $inc: { voteCount: counter },
      },
      { new: true, upsert: true },
    );

    user.notifications.push({ message, content });
    await user.save();
  } else {
    message = currentUserName + ' unliked your post';
    counter = -1;
    //isLiked = false;
    post = await Post.findByIdAndUpdate(
      id,
      {
        //$set: { isLikedByCurrentUser: isLiked },
        $pull: { likedByUsers: userId },
        $inc: { voteCount: counter },
      },
      { new: true, upsert: true },
    );
    user.notifications.push({ message, content });
    await user.save();
  }

  //console.log(post);

  if (!post)
    return next(new Error(`Post with id: ${req.user._id} does not exist`, 400));

  res.status(200).json({ message: message });
});

/**
 * @desc     create a post by a logged in user
 * @route    POST /api/v1/post/create
 * @access   Private
 */
exports.createPost = asyncHandler(async (req, res) => {
  //console.log(req.body);

  // finding the required community
  const community = await Community.find({
    name: req.body.community.name,
  }).select(['_id', 'tags']);
  // console.log(community.tags);

  // adding required fields
  req.body.postedBy = mongoose.Types.ObjectId(req.user.id);
  req.body.community = mongoose.Types.ObjectId(community[0]._id);
  req.body.tags = [community[0].tags[0]]; // setting the tag to the tag of the community for now
  req.body.voteCount = 0;
  req.body.commentCount = 0;
  req.body.likedByUsers = [];

  const post = await Post.create(req.body);
  //console.log(post);

  res.status(200).json(post); //changed to return the created post
});

/**
 * @desc  create a comment of a post by a logged in user
 * @route    POST /api/v1/post/:postId/comment/create
 * @access   Private
 */
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.postedBy = mongoose.Types.ObjectId(req.user.id);
  req.body.parentPost = mongoose.Types.ObjectId(req.params.postId);
  req.body.repliedTo = null;
  req.body.voteCount = 0;

  const postChecker = await Post.findById(req.body.parentPost);
  if (!postChecker) {
    return next(
      new ErrorResponse(
        `Post With id ${req.params.postId} does not exist`,
        404,
      ),
    );
  }

  const notifiedUser = postChecker.postedBy;
  //const notificationToBeSendUserId = postedByUser.postedBy;

  const currentUserInfo = await User.findById(req.user.id).select('name');
  const currentUserName = currentUserInfo.name;

  const message = currentUserName + ' commented on your post';
  const content = req.body.content;
  //console.log('comment ', content, ' mes ', message);

  const comment = await Comment.create(req.body);
  // console.log(comment._id);

  // Querying the required data
  const commentResponse = await Comment.find(comment._id)
    .select(['_id', 'content', 'asPseudo', 'voteCount', 'createdAt'])
    .populate({
      path: 'postedBy',
      select: '_id name image rank',
    })
    .lean();

  // editing the createdAt field
  commentResponse[0].createdAt = getTimeDiff(commentResponse[0].createdAt);
  delete commentResponse[0].postedBy.usertype;

  // pushing the newly created comment in the post field
  await Post.findByIdAndUpdate(
    req.body.parentPost,
    { $inc: { commentCount: 1 } },
    { new: true, upsert: true },
  );

  //console.log(updatedPost);

  const user = await User.findById(notifiedUser);
  user.notifications.push({ message, content });
  await user.save();

  res.status(200).json(commentResponse[0]);
});

/**
 * @desc     create a reply of a comment by a logged-in user
 * @route    POST /post/:postId/comment/:commentId/reply/create
 * @access   Private
 */
exports.createReply = asyncHandler(async (req, res, next) => {
  req.body.postedBy = mongoose.Types.ObjectId(req.user.id);
  req.body.parentPost = mongoose.Types.ObjectId(req.params.postId);
  req.body.repliedTo = mongoose.Types.ObjectId(req.params.commentId);

  const postChecker = await Post.findById(req.body.parentPost);
  if (!postChecker) {
    return next(
      new ErrorResponse(
        `Post With id ${req.params.postId} does not exist`,
        404,
      ),
    );
  }

  const commentChecker = await Comment.findById(req.body.repliedTo);
  if (!commentChecker) {
    return next(
      new ErrorResponse(
        `Comment With id ${req.params.commentId} does not exist`,
        404,
      ),
    );
  }

  const reply = await Comment.create(req.body);
  // console.log(comment._id);

  // Querying the required data
  const replyResponse = await Comment.find(reply._id)
    .select(['_id', 'content', 'asPseudo', 'voteCount', 'createdAt'])
    .populate({
      path: 'postedBy',
      select: '_id name image rank',
    })
    .lean();

  // editing the createdAt field
  replyResponse[0].createdAt = getTimeDiff(replyResponse[0].createdAt);
  delete replyResponse[0].postedBy.usertype;

  // console.log(replyResponse);

  // pushing the newly created reply in the comment's array of replies
  await Comment.findByIdAndUpdate(
    req.params.commentId,
    { $push: { replies: replyResponse[0]._id } },
    { new: true, upsert: true },
  );

  res.status(200).json(replyResponse[0]);
});

/**
 * @desc     get all the replies of a comment
 * @route    GET /post/:postId/comment/:commentId/replies
 * @access   Private
 */
exports.getRepliesOfComment = asyncHandler(async (req, res, next) => {
  const commentId = mongoose.Types.ObjectId(req.params.commentId);

  const postChecker = await Post.findById(req.params.postId);
  if (!postChecker) {
    return next(
      new ErrorResponse(
        `Post With id ${req.params.postId} does not exist`,
        404,
      ),
    );
  }

  const commentChecker = await Comment.findById(commentId);
  if (!commentChecker) {
    return next(
      new ErrorResponse(
        `Comment With id ${req.params.commentId} does not exist`,
        404,
      ),
    );
  }

  //Querying the required data
  const replies = await Comment.find({ repliedTo: commentId })
    .select(['_id', 'content', 'asPseudo', 'voteCount', 'createdAt'])
    .populate({
      path: 'postedBy',
      select: '_id name image rank',
    })
    .lean();

  //console.log(replies)

  // editing the createdAt field
  replies.forEach(reply => {
    reply.createdAt = getTimeDiff(reply.createdAt);
    delete reply.postedBy.usertype;
  });

  res.status(200).json(replies);
});

/**
 * @desc     get all post information given the post id
 * @route    GET /post/:postId
 * @access   Private
 */
exports.getPostById = asyncHandler(async (req, res, next) => {
  const postId = mongoose.Types.ObjectId(req.params.postId);
  const queryField = getQueryOption(req);

  const populationQuery = [
    {
      path: 'postedBy',
      select: '_id name image rank',
    },
    {
      path: 'community',
      select: '_id name',
    },
  ];

  const postChecker = await Post.findById(postId);
  if (!postChecker) {
    return next(
      new ErrorResponse(
        `Post With id ${req.params.postId} does not exist`,
        404,
      ),
    );
  }

  const post = await Post.find(postId)
    .select([
      '_id',
      'title',
      'content',
      'asPseudo',
      'voteCount',
      'commentCount',
      'tags',
      'createdAt',
    ])
    .populate(populationQuery)
    .lean();

  // fixing the disease field
  const tagInfo = await Disease.find({
    _id: { $in: post[0].tags },
  }).select(['title']);

  for (let i = 0; i < tagInfo.length; i++) {
    post[0].tags[i] = tagInfo[i].title;
  }

  //editing the createdAt field

  post[0].createdAt = getTimeDiff(post[0].createdAt);
  delete post[0].postedBy.usertype;

  // query for comments
  const comments = await Comment.find({
    parentPost: post[0]._id,
    repliedTo: null,
  })
    .select(['_id', 'content', 'asPseudo', 'voteCount', 'replies', 'createdAt'])
    .populate({
      path: 'postedBy',
      select: '_id name image rank role',
    })
    .sort(queryField)
    .lean();

  //console.log(comments);

  // editing the comment's field
  comments.forEach(comment => {
    comment.createdAt = getTimeDiff(comment.createdAt);
    comment.replyCount = comment.replies.length;
    delete comment.replies;
    delete comment.postedBy.usertype;
  });

  // seprating the professional and regular user
  let sortedComments = comments;

  // if we have to sort by professional user
  if (req.query.commentsSortedBy === 'professional') {
    sortedComments = sortByProfessional(comments);
  }

  sortedComments.forEach(comment => delete comment.postedBy.role);
  post[0].comments = sortedComments;
  res.status(200).json(post[0]);
});

/**
 * @desc     get feed of a user
 * @route    GET /post/feed
 * @access   Private
 */
exports.getFeed = asyncHandler(async (req, res) => {
  const queryField = getQueryOption(req);

  // search for user community first
  const user = await User.findById(req.user._id).select(['communities']);
  const userCommunities = user.communities;

  const populationQuery = [
    {
      path: 'postedBy',
      select: '_id name image rank role',
    },
    {
      path: 'community',
      select: '_id name',
    },
  ];

  const posts = await Post.find({ community: { $in: userCommunities } })
    .select([
      '_id',
      'title',
      'content',
      'asPseudo',
      'voteCount',
      'commentCount',
      'createdAt',
      'likedByUsers',
    ])
    .populate(populationQuery)
    .sort(queryField)
    .lean();

  // editing the createdAt field

  posts.forEach(post => {
    post.createdAt = getTimeDiff(post.createdAt);
    post.isLikedByCurrentUser = presentinTheArray(
      post.likedByUsers,
      req.user._id,
    );

    delete post.postedBy.usertype;
    delete post.likedByUsers;
  });
  //console.log(posts);
  //console.log('feeed uswer id ', req.user._id);

  // seprating the professional and regular user
  let sortedPosts = posts;

  // if we have to sort profession
  if (req.query.feedSortedBy === 'professional') {
    sortedPosts = sortByProfessional(posts);
  }

  sortedPosts.forEach(post => delete post.postedBy.role);
  res.status(200).json(sortedPosts);
});

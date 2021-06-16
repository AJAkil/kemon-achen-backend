const User = require('../models/User');
const ProfessionalUser = require('../models/ProfessionalUser');
const RegularUser = require('../models/RegularUser');
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
 * @desc     gets information about a community
 * @route    GET /api/v1/community/:communityId/information
 * @access   Private
 */
exports.getCommunityInformation = asyncHandler(async (req, res, next) => {
  const communityId = mongoose.Types.ObjectId(req.params.communityId);
  let communityInfo = await Community.findById(communityId)
    .select(['_id', 'image', 'tags', 'users', 'name', 'description'])
    .lean();

  communityInfo.members = communityInfo.users.length;
  communityInfo.users = communityInfo.users.map(user => user.toString());
  communityInfo.hasJoined = communityInfo.users.includes(
    req.user._id.toString(),
  );

  // fixing the disease field
  const tagInfo = await Disease.find({
    _id: { $in: communityInfo.tags },
  }).select(['title']);

  communityInfo.tags = tagInfo.map(tag => tag.title);

  delete communityInfo.users;

  res.status(200).json(communityInfo);
});

/**
 * @desc     gets information about a community
 * @route    GET /api/v1/community/:communityId/feed
 * @access   Private
 */
exports.getCommunityFeed = asyncHandler(async (req, res, next) => {
  const communityId = mongoose.Types.ObjectId(req.params.communityId);
  const queryField = getQueryOption(req);

  const populationQuery = [
    {
      path: 'postedBy',
      select: '_id name rank role',
    },
  ];

  const posts = await Post.find({ community: communityId })
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
  console.log(posts);
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

/**
 * @desc     gets information about a community
 * @route    GET /api/v1/community/:communityId/information
 * @access   Private
 */
exports.getCommunityInformation = asyncHandler(async (req, res, next) => {
  const communityId = mongoose.Types.ObjectId(req.params.communityId);
  let communityInfo = await Community.findById(communityId)
    .select(['_id', 'image', 'tags', 'users', 'name', 'description'])
    .lean();

  communityInfo.members = communityInfo.users.length;
  communityInfo.users = communityInfo.users.map(user => user.toString());
  communityInfo.hasJoined = communityInfo.users.includes(
    req.user._id.toString(),
  );

  // fixing the disease field
  const tagInfo = await Disease.find({
    _id: { $in: communityInfo.tags },
  }).select(['title']);

  communityInfo.tags = tagInfo.map(tag => tag.title);

  delete communityInfo.users;

  res.status(200).json(communityInfo);
});

/**
 * @desc     update about
 * @route    POST /api/v1/community/:communityId/updateAbout
 * @access   Private
 */
exports.updateAbout = asyncHandler(async (req, res, next) => {
  const communityId = mongoose.Types.ObjectId(req.params.communityId);

  console.log(req.body);

  let communityInfo = await Community.findByIdAndUpdate(communityId, {
    about: req.body,
  });

  res.status(200).json('communityInfo');
});

/**
 * @desc     update about
 * @route    GET /api/v1/community/:communityId/about
 * @access   Private
 */
exports.getCommunityAbout = asyncHandler(async (req, res, next) => {
  const communityId = mongoose.Types.ObjectId(req.params.communityId);

  let communityInfo = await Community.findByIdAndUpdate(communityId).select([
    'about',
  ]);

  res.status(200).json(communityInfo);
});
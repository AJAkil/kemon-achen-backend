const Disease = require('../models/Disease');
const Post = require('../models/Post');
const User = require('../models/User');
const Community = require('../models/Community');
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
exports.getCommunityInformation = asyncHandler(async (req, res) => {
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
exports.getCommunityFeed = asyncHandler(async (req, res) => {
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

/**
 * @desc     gets information about a community
 * @route    GET /api/v1/community/:communityId/information
 * @access   Private
 */
exports.getCommunityInformation = asyncHandler(async (req, res) => {
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
exports.updateAbout = asyncHandler(async (req, res) => {
  const communityId = mongoose.Types.ObjectId(req.params.communityId);

  console.log(req.body);

  let communityInfo = await Community.findByIdAndUpdate(communityId, {
    about: req.body,
  });

  res.status(200).json(communityInfo);
});

/**
 * @desc     update about
 * @route    GET /api/v1/community/:communityId/about
 * @access   Private
 */
exports.getCommunityAbout = asyncHandler(async (req, res) => {
  const communityId = mongoose.Types.ObjectId(req.params.communityId);

  let communityInfo = await Community.findByIdAndUpdate(communityId).select([
    'about',
  ]);

  res.status(200).json(communityInfo);
});

/**
 * @desc     update about
 * @route    GET /api/v1/community/:communityId/postSearch
 * @access   Private
 */
exports.searchCommunityPosts = asyncHandler(async (req, res) => {
  const communityId = mongoose.Types.ObjectId(req.params.communityId);

  // const populationQuery = [
  //   {
  //     path: 'postedBy',
  //     select: '_id name rank role',
  //   },
  // ];

  // let posts = await Post.find({
  //   community: communityId,
  //   $text: { $search: req.query.searchKeyword },
  // })
  //   .select([
  //     '_id',
  //     'title',
  //     'content',
  //     'asPseudo',
  //     'voteCount',
  //     'commentCount',
  //     'createdAt',
  //     'likedByUsers',
  //     'postType',
  //   ])
  //   .populate(populationQuery)
  //   .sort({ createdAt: -1 })
  //   .lean();

  // posts.forEach(post => {
  //   post.createdAt = getTimeDiff(post.createdAt);
  //   post.isLikedByCurrentUser = presentinTheArray(
  //     post.likedByUsers,
  //     req.user._id,
  //   );

  //   delete post.postedBy.usertype;
  //   delete post.likedByUsers;
  // });

  let posts = await Post.aggregate([
    {
      $match: {
        $and: [
          { community: mongoose.Types.ObjectId(req.params.communityId) },
          {
            $or: [
              {
                title: {
                  $regex: req.query.searchKeyword,
                  $options: 'i',
                },
              },
              {
                content: {
                  $regex: req.query.searchKeyword,
                  $options: 'i',
                },
              },
            ],
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        asPseudo: 1,
        voteCount: 1,
        commentCount: 1,
        createdAt: 1,
        likedByUsers: 1,
        postType: 1,
        postedBy: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  // saving the posts in a map
  let postsPostedBy = posts.map(post => post.postedBy);

  let users = await User.find({
    _id: { $in: postsPostedBy },
  })
    .select(['_id', 'name', 'rank', 'role'])
    .lean();

  let postedBy = {};

  users.map(user => {
    postedBy[user._id] = user;
  });

  posts.forEach(post => {
    post.createdAt = getTimeDiff(post.createdAt);
    post.isLikedByCurrentUser = presentinTheArray(
      post.likedByUsers,
      req.user._id,
    );

    delete postedBy[post.postedBy].usertype;
    post.postedBy = postedBy[post.postedBy];
    delete post.likedByUsers;
  });

  //console.log(posts);

  res.status(200).json(posts);
});

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
  sendTokenResponse,
  getTimeDiff,
  presentinTheArray,
} = require('../utils/helperMethods');

/**
 * @desc     Signup Regular User
 * @route    POST /api/v1/user/regular/signup
 * @access   Public
 */
exports.signupRegularUser = asyncHandler(async (req, res, next) => {
  const { role, email, name, password } = req.body;

  // Check if an user with the same email exist in the database
  const user = await User.findOne({ email: email });

  if (user)
    return next(new ErrorResponse('This email is already registered', 400));

  if (role !== 'regular')
    return next(
      new ErrorResponse(
        'Wrong role in request body. Role must be regular.',
        400,
      ),
    );

  // Create Regular User
  const regularUser = await RegularUser.create({
    email,
    name,
    password,
    role,
  });

  const responseObject = {
    _id: regularUser.id,
    role: regularUser.role,
    name: regularUser.name,
    image: regularUser.image,
    message:
      "Welcome to Kemon Achen! Let's take a step towards healing together <3",
  };

  sendTokenResponse(regularUser, 200, res, responseObject);
});

/**
 * @desc     Signup Professional User
 * @route    POST /api/v1/user/professional/signup
 * @access   Public
 */
exports.signupProfessionalUser = asyncHandler(async (req, res, next) => {
  const {
    role,
    email,
    name,
    password,
    verified,
    license,
    licenseIssued,
    specializations,
  } = req.body;

  // Check if an user with the same email exist in the database
  // Check for the user
  const user = await User.findOne({ email: email });

  if (user)
    return next(new ErrorResponse('This email is already registered', 400));

  if (role !== 'professional')
    return next(
      new ErrorResponse(
        'Wrong role in request body. Role must be professional',
        400,
      ),
    );

  // console.log(specializations)
  // find the name of the disease tags from the database
  let specialization = await Disease.find({
    title: {
      $in: specializations,
    },
  });

  // console.log(specialization)

  specialization = specialization.map(tags => tags._id);

  // console.log(specialization);
  // Create Regular User
  const professionalUser = await ProfessionalUser.create({
    email,
    name,
    password,
    role,
    verified,
    license,
    licenseIssued,
    specialization,
  });

  const responseObject = {
    _id: professionalUser.id,
    role: professionalUser.role,
    name: professionalUser.name,
    image: professionalUser.image,
    message: 'You are awaiting verification',
  };

  sendTokenResponse(professionalUser, 200, res, responseObject);
});

/**
 * @desc     Login User
 * @route    POST /api/v1/user/login
 * @access   Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password)
    return next(new ErrorResponse('Please Provide an email and password'), 400);

  // Check for the user
  const user = await User.findOne({ email: email }).select('+password');
  // console.log(user);

  // Validate User
  if (!user) {
    // console.log("here");
    return next(new ErrorResponse('Invalid Credentials: Wrong Email!', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch)
    return next(new ErrorResponse('Invalid Credentials: Wrong Password!', 401));

  const responseObject = {
    _id: user.id,
    role: user.role,
    image: user.image,
    name: user.name,
  };

  sendTokenResponse(user, 200, res, responseObject);
});

/**
 * @desc     gets an user
 * @route    GET /api/v1/auth/me
 * @access   Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc     gets all posts of an user
 * @route    GET /api/v1/user/:userid/posts
 * @access   Private
 */
exports.getUserPosts = asyncHandler(async (req, res, next) => {
  // find user first
  const user = await User.findById(req.params.userid);
  // check to see if user exists on the database
  if (!user)
    return next(
      new ErrorResponse(`User not found with the id ${req.params.userid}`, 404),
    );

  // find posts in Post collection
  const posts = await Post.find({
    postedBy: {
      $in: user._id,
    },
  })
    .select(['title', 'content', 'voteCount', 'commentCount', 'createdAt', 'likedByUsers'])
    .populate('community', ['name', 'image'])
    .lean();

  // console.log(posts)

  posts.forEach(post => {
    post.createdAt = getTimeDiff(post.createdAt);
    post.isLikedByCurrentUser = presentinTheArray(
      post.likedByUsers,
      req.user._id,
    );

    delete post.likedByUsers;
  });
  // console.log(createdAt);

  res.status(200).json(posts);
});

/**
 * @desc     gets all comments of an user
 * @route    GET /api/v1/user/:userid/comments
 * @access   Private
 */
exports.getUserComments = asyncHandler(async (req, res, next) => {
  // find user first
  const user = await User.findById(req.params.userid);

  // check to see if user exists on the database
  if (!user)
    return next(
      new ErrorResponse(`User not found with the id ${req.params.id}`, 404),
    );

  // find posts in Post collection
  const comments = await Comment.find({
    postedBy: {
      $in: user._id,
    },
  })
    .select(['content', 'createdAt', 'repliedTo'])
    .populate({
      path: 'parentPost',
      select: '_id title',
    })
    .lean();

  comments.forEach(comment => {
    comment.createdAt = getTimeDiff(comment.createdAt);
  });

  res.status(200).json(comments);
});

/**
 * @desc     gets all communties of a logged in user
 * @route    GET /api/v1/user/communities
 * @access   Private
 */
exports.getUserCommunities = asyncHandler(async (req, res) => {
  // find communities of a user
  const communities = await Community.find({
    users: {
      $in: req.user._id,
    },
  }).select(['name', 'image']);

  res.status(200).json(communities);
});

/**
 * @desc     Joins a user to a community
 * @route    GET /api/v1/user/community/:communityId/join
 * @access   Private
 */
exports.joinCommunity = asyncHandler(async (req, res, next) => {
  // console.log(typeof(req.params.communityId));

  const id = mongoose.Types.ObjectId(req.params.communityId);
  // console.log(typeof(id));

  // check to see if the user belongs to the certain community
  const community = await Community.find({
    _id: id,
    users: {
      $in: req.user._id,
    },
  });

  console.log(community);
  if (community.length !== 0)
    return next(
      new Error(
        `User with id: ${req.user._id} has already joined the community`,
        400,
      ),
    );

  const updatedCommunity = await Community.findByIdAndUpdate(
    id,
    { $push: { users: req.user._id } },
    { new: true, upsert: true },
  );

  // console.log(updatedCommunity);

  if (!updatedCommunity) {
    return next(
      new ErrorResponse(
        `Failed to update Community with id: ${id} with User: ${req.user._id}`,
      ),
    );
  }

  // Now update the user to include the community
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { communities: id } },
    { new: true, upsert: true },
  );

  if (!updatedUser) {
    return next(
      new ErrorResponse(
        `Failed to update User with id: ${req.user._id} with Community Id: ${id}`,
      ),
    );
  }

  res
    .status(200)
    .json({ message: 'You are added to the community successfully' });
});

/**
 * @desc     gets all saved posts of a logged in user
 * @route    GET /api/v1/user/savedPosts
 * @access   Private
 */
exports.getSavedPosts = asyncHandler(async (req, res) => {
  // get the saved posts of an user
  const savedPosts = await User.findById(req.user._id)
    .populate({
      path: 'savedPosts',
      select: '_id',
    })
    .select(['_id'])
    .lean();

  // Now filter the ids from the savedPosts object
  let postIds = savedPosts.savedPosts;
  postIds = postIds.map(post => {
    return mongoose.Types.ObjectId(post._id);
  });

  //console.log(postIds);

  // Perform query upon the post collection to get details about the posts
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

  const posts = await Post.find({ _id: { $in: postIds } })
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
  // console.log(posts);

  //console.log(savedPosts);

  res.status(200).json(posts);
});

/**
 * @desc     gets all saved posts of a logged in user
 * @route    GET /api/v1/user/professional/:userid/info
 * @access   Private
 */
exports.getProfessionalInformation = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.params.userid);
  const professionalInfo = await User.findById(userId)
    .populate({
      path: 'specialization',
      select: 'title',
    })
    .select(['_id', 'name', 'rank', 'image'])
    .lean();

  professionalInfo.specialization = professionalInfo.specialization.map(
    s => s.title,
  );
  delete professionalInfo.usertype;

  res.status(200).json(professionalInfo);
});

/**
 * @desc     gets all saved posts of a logged in user
 * @route    GET /api/v1/user/professional/:userid/chamber
 * @access   Private
 */
exports.getProfessionalChamberInformation = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.params.userid);
  const professionalChamberInfo = await User.findById(userId)
    .select([
      '_id',
      'phone',
      'email',
      'qualification',
      'license',
      'licenseIssued',
      'about',
      'address',
    ])
    .lean();

  // professionalInfo.specialization = professionalInfo.specialization.map(
  //   s => s.title,
  // );
  delete professionalChamberInfo.usertype;

  res.status(200).json(professionalChamberInfo);
});

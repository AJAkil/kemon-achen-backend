const User = require("../models/User");
const ProfessionalUser = require("../models/ProfessionalUser");
const RegularUser = require("../models/RegularUser");
const Disease = require("../models/Disease");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Community = require("../models/Community");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { sendTokenResponse } = require('../utils/helperMethods');

// @desc     Signup Regular User
// @route    POST /api/v1/user/regular/signup
// @access   Public
exports.signupRegularUser = asyncHandler(async (req, res, next) => {

  const { role, email, password } = req.body;

  // Check if an user with the same email exist in the database
  const user = await User.findOne({ email: email });

  if(user){
     return next(new ErrorResponse('This email is already registered', 400))
  }

  if (role !== "regular") {
    return next(new ErrorResponse('Wrong role in request body. Role must be regular.', 400))
  }

  // Create Regular User
  const regularUser = await RegularUser.create({
    email,
    password,
    role,
  });

  let responseObject = {
    _id: regularUser.id,
    role: regularUser.role,
    avatar: regularUser.image,
    message:
      "Welcome to Kemon Achen! Let's take a step towards healing together <3",
  };

  sendTokenResponse(regularUser, 200, res, responseObject);
});

// @desc     Signup Professional User
// @route    POST /api/v1/user/professional/signup
// @access   Public
exports.signupProfessionalUser = asyncHandler(async (req, res, next) => {
  const {
    role,
    email,
    password,
    verified,
    license,
    licenseIssued,
    specializations,
  } = req.body;

  // Check if an user with the same email exist in the database
  // Check for the user
  const user = await User.findOne({ email: email });

  if(user){
     return next(new ErrorResponse('This email is already registered', 400))
  }


  if (role !== "professional") {
    return next(new ErrorResponse('Wrong role in request body. Role must be professional', 400))
  }

  //console.log(specializations)
  // find the name of the disease tags from the database
  let specialization = await Disease.find({
    "title" : {
      $in: specializations
    }
  })

  //console.log(specialization)

  specialization = specialization.map( tags => tags._id)

  //console.log(specialization);
  // Create Regular User
  const professionalUser = await ProfessionalUser.create({
    email,
    password,
    role,
    verified,
    license,
    licenseIssued,
    specialization,
  });

  let responseObject = {
    _id: professionalUser.id,
    role: professionalUser.role,
    avatar: professionalUser.image,
    message: "You are awaiting verification",
  };

  sendTokenResponse(professionalUser, 200, res, responseObject);
});

// @desc     Login User
// @route    POST /api/v1/user/login
// @access     Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide an email and password"), 400);
  }

  // Check for the user
  const user = await User.findOne({ email: email }).select("+password");
  //console.log(user);

  // Validate User
  if (!user) {
    //console.log("here");
    return next(new ErrorResponse("Invalid Credentials: Wrong Email!", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials: Wrong Password!", 401));
  }

  let responseObject = {
    _id: user.id,
    role: user.role,
    avatar: user.image,
    name: "no name",
  };

  sendTokenResponse(user, 200, res, responseObject);
});

// @desc     gets an user
// @route    GET /api/v1/auth/me
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});


// @desc     gets all posts of an user
// @route    GET /api/v1/user/:userid/posts
// @access   Private
exports.getUserPosts = asyncHandler(async (req, res, next) => {

  // find user first
  const user = await User.findById(req.params.userid);

  // check to see if user exists on the database
  if (!user) {
    return next(
      new ErrorResponse(`User not found with the id ${req.params.id}`, 404)
    );
  }

  // find posts in Post collection
  let posts = await Post.find({
    "postedBy" : {
      $in: user._id
    }
  }).select(['title', 'content', 'voteCount', 'comments', 'createdAt']).populate('community', ['name', 'image'])

  //posts.populate('communities');
  //console.log(posts);

  //console.log(posts)

  // find comments of the posts
  // let comments = await Comment.find({
  //   '_id': {
  //     $in: posts[1].comments[0]
  //   }
  // })

  let responseArray = []
  let responseObject = {}
  // let communityToPostTracker = { }

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    responseObject._id = post._id;
    responseObject.title = post.title
    responseObject.content = post.content;
    responseObject.voteCount = post.voteCount
    responseObject.commentCount = post.comments.length
    responseObject.community = post.community;
    responseObject.createdAt = Date.now() - post.createdAt;

    responseArray.push(responseObject);
    //communityToPostTracker[post.community].push(i);
    responseObject = {};
  }

  // //console.log(responseArray)

  // let postCommunities = posts.map( post => post.community)
  // console.log(postCommunities);
  
  // // Search for communities in the database
  // let communities = await Community.find({
  //     '_id': postCommunities
  //   })

  // console.log(communities)
  
  // let communityProperties = communities.map(comm => {
  //   let properties = {
  //     _id: comm._id,
  //     name: comm.name,
  //     avatar: comm.image
  //   }
  //   return properties;
  // })

  // console.log(communityProperties);
  
  // communityProperties.forEach( comm => {

  //   responseArray[].community = comm
  // })

  // console.log(responseArray)


  res.status(200).json({ success: true, data: responseArray });
});


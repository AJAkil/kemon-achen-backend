const User = require("../models/User");
const ProfessionalUser = require("../models/ProfessionalUser");
const RegularUser = require("../models/RegularUser");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc     Signup Regular User
// @route    POST /api/v1/user/regular/signup
// @access   Public
exports.signupRegularUser = asyncHandler(async (req, res, next) => {
  const { role, email, password } = req.body;

  if (role !== "regular") {
    return next(new ErrorResponse('Wrong role in request body. Role must be regular.'))
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
    specialization,
  } = req.body;


  if (role !== "professional") {
    return next(new ErrorResponse('Wrong role in request body. Role must be professional'))
  }

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
// @route    POST /api/v1/auth/login
// @access     Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide an email and password"), 400);
  }

  // Check for the user
  const user = await User.findOne({ email: email }).select("+password");
  console.log(user);

  // Validate User
  if (!user) {
    console.log("here");
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

// @desc     Login User
// @route    GET /api/v1/auth/me
// @access     Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, responseObject) => {
  // Create token
  const token = user.getSignedJwtToken();

  responseObject.token = token;

  res.status(statusCode).json(responseObject);
};

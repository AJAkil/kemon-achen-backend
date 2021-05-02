const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if(req.cookies.token){
  //     token = req.cookies.token;
  // }

  //console.log(token);

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route'), 401);
  }

  try {
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);

    req.user = await User.findById(decoded.id);
    console.log(req.user.email);
    next();
  } catch (e) {
    return next(new ErrorResponse('Not authorized to access this route'), 401);
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access the route`,
          403,
        ),
      );
    }
    next();
  };
};

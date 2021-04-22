// Get token from model, create cookie and send response
exports.sendTokenResponse = (user, statusCode, res, responseObject) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    responseObject.token = token;
  
    res.status(statusCode).json(responseObject);
  };
  
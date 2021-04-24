// Get token from model, create cookie and send response
exports.sendTokenResponse = (user, statusCode, res, responseObject) => {
  // Create token
  const token = user.getSignedJwtToken();

  responseObject.token = token;

  res.status(statusCode).json(responseObject);
};

exports.getTimeDiff = (datetime) => {
  let givenTime = new Date(datetime).getTime();
  let now = new Date().getTime();

  //console.log(givenTime + " " + now);
  let milisecDiff = -1;

  if (datetime < now) {
    milisecDiff = now - givenTime;
  } else {
    milisecDiff = givenTime - now;
  }

  let months = Math.floor(milisecDiff / 1000 / 60 / (60 * 24) / 30);
  let days = Math.floor(milisecDiff / 1000 / 60 / (60 * 24));
  let hours = Math.floor(milisecDiff / 1000 / 60 / 60);
  let minutes = Math.floor(milisecDiff / 1000 / 60);
  let seconds = Math.floor(milisecDiff / 1000);

  if (months != 0) return months+" "+"months";
  else if (days != 0) return days+" "+"days";
  else if (hours != 0) return hours+" "+"hours";
  else if (minutes != 0) return minutes+" "+"minutes";
  else if (seconds != 0) return seconds+" "+"seconds";
};

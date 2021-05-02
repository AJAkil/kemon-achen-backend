// Get token from model, create cookie and send response
exports.sendTokenResponse = (user, statusCode, res, responseObject) => {
  // Create token
  const token = user.getSignedJwtToken();

  responseObject.jwt = "Bearer " + token;

  res.status(statusCode).json(responseObject);
};

exports.getTimeDiff = (datetime) => {
  //console.log('Given date time: ', datetime);
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

  console.log(months, days, hours, minutes, seconds);

  if (months != 0) return months + " " + "mo";
  else if (days != 0) return days + " " + "d";
  else if (hours != 0) return hours + " " + "h";
  else if (minutes != 0) return minutes + " " + "m";
  else return seconds + " " + "s";
};

exports.removeItemOnce = (arr, value) => {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};

exports.removeItemAll = (arr, value) => {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
};

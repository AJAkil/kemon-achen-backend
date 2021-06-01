// Get token from model, create cookie and send response
exports.sendTokenResponse = (user, statusCode, res, responseObject) => {
  // Create token
  const token = user.getSignedJwtToken();

  responseObject.jwt = 'Bearer ' + token;

  res.status(statusCode).json(responseObject);
};

exports.getTimeDiff = datetime => {
  // console.log('Given date time: ', datetime);
  const givenTime = new Date(datetime).getTime();
  const now = new Date().getTime();

  // console.log(givenTime + " " + now);
  let milisecDiff = -1;

  if (datetime < now) milisecDiff = now - givenTime;
  else milisecDiff = givenTime - now;

  const months = Math.floor(milisecDiff / 1000 / 60 / (60 * 24) / 30);
  const days = Math.floor(milisecDiff / 1000 / 60 / (60 * 24));
  const hours = Math.floor(milisecDiff / 1000 / 60 / 60);
  const minutes = Math.floor(milisecDiff / 1000 / 60);
  const seconds = Math.floor(milisecDiff / 1000);

  //console.log(months, days, hours, minutes, seconds);

  if (months != 0) return months + 'mo';
  else if (days != 0) return days + 'd';
  else if (hours != 0) return hours + 'h';
  else if (minutes != 0) return minutes + 'm';
  else return seconds + 's';
};

exports.removeItemOnce = (arr, value) => {
  const index = arr.indexOf(value);
  if (index > -1) arr.splice(index, 1);

  return arr;
};

exports.removeItemAll = (arr, value) => {
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === value) arr.splice(i, 1);
    else ++i;
  }
  return arr;
};

exports.getQueryOption = req => {
  const queryDict = {
    votes: { voteCount: -1 },
    old: { createdAt: 1 },
    new: { createdAt: -1 },
    default: { createdAt: -1 },
    professional: { createdAt: -1 },
  };

  //console.log(Object.keys(req.query)[0]);

  if (Object.keys(req.query).length === 0) {
    return queryDict.default;
  } else {
    return queryDict[req.query[Object.keys(req.query)[0]]];
  }
};

exports.presentinTheArray = (array, value) => {
  let isPresent = false;
  for (let i = 0; i < array.length; i++) {
    console.log(array[i], '   val   ', value);
    if (JSON.stringify(array[i]) === JSON.stringify(value)) {
      isPresent = true;
      break;
    }
  }
  return isPresent;
};
exports.sortByProfessional = array => {
  let professionalData = array.filter(
    obj => obj.postedBy.role === 'professional',
  );
  let regularUserData = array.filter(obj => obj.postedBy.role === 'regular');

  return professionalData.concat(regularUserData);
};

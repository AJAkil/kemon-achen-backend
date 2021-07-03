const Test = require('../models/Test');
const Advice = require('../models/Advice');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc     create a test by an admin
 * @route    POST /test/create
 * @access   Admin privilege
 */
exports.createTest = asyncHandler(async (req, res) => {
  console.log(req.body);

  req.body.timesTaken = 0;
  const test = await Test.create(req.body);
  console.log(test);

  res.status(200).json(test);
});

/**
 * @desc     create a disease specific advice by an admin
 * @route    POST /test/advice/create
 * @access   Admin privilege
 */
exports.createAdvice = asyncHandler(async (req, res) => {
  console.log(req.body);
  req.body.test = mongoose.Types.ObjectId(req.body.testId);
  const advice = await Advice.create(req.body);
  console.log(advice);

  res.status(200).json(advice);
});

/**
 * @desc     get all test information given the test id
 * @route    GET /test/:testId
 * @access   Private
 */
exports.getTestById = asyncHandler(async (req, res, next) => {
  const testId = mongoose.Types.ObjectId(req.params.testId);

  const test = await Test.findById(testId).select([
    '_id',
    'name',
    'anxietyQuestions',
    'stressQuestions',
    'depressionQuestions',
  ]);

  if (!test) {
    return next(
      new ErrorResponse(
        `Test With id ${req.params.testId} does not exist`,
        404,
      ),
    );
  }
  res.status(200).json(test);
});

/**
 * @desc     submit test question answer
 * @route    POST /test/:testId/submit
 * @access   Private
 */
exports.submitTest = asyncHandler(async (req, res) => {
  console.log('user id', req.user);
  const anxietyScore = parseInt(req.body.anxiety);
  const depressionScore = parseInt(req.body.depression);
  const stressScore = parseInt(req.body.stress);


  const anxietyAdvice = await Advice.find({
    test: { _id: req.params.testId },
    disease: 'anxiety',
    $and: [
      { 'range.max': { $gt: anxietyScore } },
      { 'range.min': { $lt: anxietyScore } },
    ],
  }).select(['_id','messages', 'advice']);

  const depressionAdvice = await Advice.find({
    test: { _id: req.params.testId },
    disease: 'depression',
    $and: [
      { 'range.max': { $gt: depressionScore } },
      { 'range.min': { $lt: depressionScore } },
    ],
  }).select(['_id', 'messages', 'advice']);

  const stressAdvice = await Advice.find({
    test: { _id: req.params.testId },
    disease: 'stress',
    $and: [
      { 'range.max': { $gt: stressScore } },
      { 'range.min': { $lt: stressScore } },
    ],
  }).select(['_id', 'messages', 'advice']);

  const responseObject = {
    _id: req.params.testId,
    anxietyAdvice: anxietyAdvice,
    depressionAdvice: depressionAdvice,
    stressAdvice: stressAdvice,
  };

  // add latest advices to user's array

  // calculate status based on score range
  let anxietyStatus, stressStatus, depressionStatus, status;
  
  // anxietyStatus
  if( anxietyScore >= 0 && anxietyScore <= 7){
    anxietyStatus = 1;
  }else if( anxietyScore >= 8 && anxietyScore <= 14 ){
    anxietyStatus = 2;
  }else if(anxietyScore >= 15 && anxietyScore <= 20){
    anxietyStatus = 3;
  }

  if( depressionScore >= 0 && depressionScore <= 7){
    depressionStatus = 1;
  }else if( depressionScore >= 8 && depressionScore <= 14 ){
    depressionStatus = 2;
  }else if(depressionScore >= 15 && depressionScore <= 20){
    depressionStatus = 3;
  }

  if( stressScore >= 0 && stressScore <= 7){
    stressStatus = 1;
  }else if( stressScore >= 8 && stressScore <= 14 ){
    stressStatus = 2;
  }else if(stressScore >= 15 && stressScore <= 20){
    stressStatus = 3;
  }

  const sum = anxietyStatus + depressionStatus + stressStatus;

  if(sum === 3){
    status = 'excellent';
  }else if(sum === 4 || sum === 5 ){
    status = 'good';
  }else if(sum === 6 || sum === 7){
    status = 'bad';
  }else if(sum === 8 || sum == 9){
    status = 'concerning'; 
  }


  // construct the object and then push
  const testInfo = {
      test: req.params.testId,
      anxietyScore: anxietyScore,
      stressScore: stressScore,
      depressionScore: depressionScore,
      status: status,
      advice: [anxietyAdvice[0]._id, depressionAdvice[0]._id, stressAdvice[0]._id]
  }

  const user = await User.findOne(req.user._id);
  user.testInfo.unshift(testInfo);

  await user.save()

  res.status(200).json(responseObject);
});

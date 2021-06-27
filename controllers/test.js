const Test = require('../models/Test');
const Advice = require('../models/Advice');

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

  //console.log(typeof anxietyScore);

  const anxietyAdvice = await Advice.find({
    test: { _id: req.params.testId },
    disease: 'anxiety',
    $and: [
      { 'range.max': { $gt: anxietyScore } },
      { 'range.min': { $lt: anxietyScore } },
    ],
  }).select(['messages', 'advice']);

  const depressionAdvice = await Advice.find({
    test: { _id: req.params.testId },
    disease: 'depression',
    $and: [
      { 'range.max': { $gt: depressionScore } },
      { 'range.min': { $lt: depressionScore } },
    ],
  }).select(['messages', 'advice']);

  const stressAdvice = await Advice.find({
    test: { _id: req.params.testId },
    disease: 'stress',
    $and: [
      { 'range.max': { $gt: stressScore } },
      { 'range.min': { $lt: stressScore } },
    ],
  }).select(['messages', 'advice']);

  const responseObject = {
    _id: req.params.testId,
    anxietyAdvice: anxietyAdvice,
    depressionAdvice: depressionAdvice,
    stressAdvice: stressAdvice,
  };

  res.status(200).json(responseObject);
});

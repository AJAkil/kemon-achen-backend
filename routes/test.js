const express = require('express');
const {
  createTest,
  getTestById,
  createAdvice,
  submitTest,
} = require('../controllers/test');
const { protect } = require('../middleware/auth');

const router = express.Router();

//GET
router.get('/:testId', protect, getTestById);

//POST
router.post('/:testId/submit', protect, submitTest);
router.post('/create', createTest);
router.post('/advice/create', createAdvice);

module.exports = router;

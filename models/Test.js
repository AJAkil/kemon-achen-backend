const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema(
  {
    name: String,
    anxietyQuestions: [
      {
        question: String,
      },
    ],
    stressQuestions: [
      {
        question: String,
      },
    ],
    depressionQuestions: [
      {
        question: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Test', TestSchema);

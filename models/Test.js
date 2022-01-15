const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema(
  {
    name: String,
    timesTaken: Number,
    anxietyQuestions: [
      {
        type: String,
      },
    ],
    stressQuestions: [
      {
        type: String,
      },
    ],
    depressionQuestions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Test', TestSchema);

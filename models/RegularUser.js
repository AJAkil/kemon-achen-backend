const mongoose = require('mongoose');
const User = require('./User');

const RegularUserSchema = new mongoose.Schema({
  pseudonym: String,
  currentDiseases: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Disease',
    },
  ],
  testInfo: [
    {
      test: {
        type: mongoose.Schema.ObjectId,
        ref: 'Test',
      },
      score: Number,
    },
  ],
  history: [
    {
      disease: {
        type: mongoose.Schema.ObjectId,
        ref: 'Disease',
      },
      startDate: Date,
    },
  ],
});

const RegularUser = User.discriminator('RegularUser', RegularUserSchema);

module.exports = RegularUser;

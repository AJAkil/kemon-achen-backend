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
  isDoneNotifying: Boolean, // for concluding pop-ups/push noti(related to activity) if user presses yes
  testInfo: [
    {
      type: new mongoose.Schema(
        {
          test: {
            type: mongoose.Schema.ObjectId,
            ref: 'Test',
          },
          anxietyScore: Number,
          stressScore: Number,
          depressionScore: Number,
          status: {
            type: String,
            enum: ['excellent', 'good', 'bad', 'concerning'],
          },
          advice: [
            {
              type: mongoose.Schema.ObjectId,
              ref: 'Advice',
            },
          ],
        },
        { timestamps: true },
      ),
    },
  ],
});

const RegularUser = User.discriminator('RegularUser', RegularUserSchema);

module.exports = RegularUser;

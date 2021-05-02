const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema(
    {
      name: String,
      questions: [
        {
          text: String,
          timesTaken: Number,
          scale: Number,
          sentiment: {
            type: String,
            enum: ['positive', 'negative'],
            default: 'positive',
          },
          depression: {
            high: Number, // 100
            low: Number, // 0
          },
          anxiety: {
            high: Number,
            low: Number,
          },
          stress: {
            high: Number,
            low: Number,
          },
        },
      ],
      community: {
        type: mongoose.Schema.ObjectId,
        ref: 'Community',
      },
      postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Test', TestSchema);

const mongoose = require('mongoose');

const AdviceSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.ObjectId,
      ref: 'Test',
    },
    disease: String,
    messages: [
      {
        type: String,
      },
    ],
    advice: [
      {
        type: String,
      },
    ],
    range: {
      min: Number,
      max: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Advice', AdviceSchema);

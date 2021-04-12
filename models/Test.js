const mongoose = require("mongoose");

const Test = mongoose.model(
  "Test",
  new mongoose.Schema({
    name: String,
    questions: [
      {
        text: String,
        depression: {
          high: Number,
          low: Number,
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);

module.exports = Test;

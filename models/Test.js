const mongoose = require("mongoose");

const Test = mongoose.model(
  "Test",
  new mongoose.Schema(
    {
      name: String,
      questions: [
        {
          text: String,
          scale: Number,
          sentiment: {
            type: String,
            enum: ["positive", "negative"],
            default: "positive",
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
        ref: "Community",
      },
    },
    { timestamps: true }
  )
);

module.exports = Test;

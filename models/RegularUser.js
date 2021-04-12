const mongoose = require("mongoose");
const User = require("./Users");

const RegularUser = User.discriminator(
  "RegularUser",
  new mongoose.Schema({
    pseudonym: String,
    disease: [String],
    testInfo: [
      {
        test: {
          type: mongoose.Schema.ObjectId,
          ref: "Test",
        },
        score: Number,
      },
    ],
  })
);

module.exports = RegularUser;

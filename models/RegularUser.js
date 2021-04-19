const mongoose = require("mongoose");
const User = require("./User");

const RegularUserSchema = new mongoose.Schema({
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
});

const RegularUser = User.discriminator("RegularUser", RegularUserSchema);

module.exports = RegularUser;

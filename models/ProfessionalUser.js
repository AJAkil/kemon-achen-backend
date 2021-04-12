const mongoose = require("mongoose");
const User = require("./Users");

const ProfessionalUser = User.discriminator(
  "ProfessionalUser",
  new mongoose.Schema({
    about: {
      type: String,
      maxLength: [500, "About cannot be more than 500 characters long"]
    },
    license: { type: String, required: true },
    qualification: {
      type: [String],
      required: [true, "Please Add qualifications"],
    },
    specialization: [String],
    rank: Number,
  })
);

module.exports = ProfessionalUser;

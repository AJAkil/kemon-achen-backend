const mongoose = require("mongoose");
const User = require("./User");

const ProfessionalUserSchema = new mongoose.Schema({
  about: {
    type: String,
    maxLength: [500, "About cannot be more than 500 characters long"],
  },
  verified: { type: Boolean, default: false },
  license: { type: String, required: true },
  licenseIssued: Date,
  qualification: {
    type: [String],
    required: [true, "Please Add qualifications"],
  },
  specialization: [String],
  rank: Number,
  tags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tag",
    },
  ],
});

const ProfessionalUser = User.discriminator(
  "ProfessionalUser",
  ProfessionalUserSchema
);

module.exports = ProfessionalUser;

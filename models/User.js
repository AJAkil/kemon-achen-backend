const mongoose = require("mongoose");

const baseOptions = {
  discriminatorKey: "usertype", // our discriminator key
  collection: "user", // the name of our collection
};

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      role: {
        type: String,
        enum: ["regular", "professional", "admin"],
        default: "regular",
      },
      password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false, //won't return password when we call user by API
      },
      name: {
        type: String,
        required: [true, "Please add a name"],
      },
      email: {
        type: String,
        match: [
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          "Please add a valid email here",
        ],
      },
      phone: {
        type: String,
        maxLength: [11, "Phone number cannot be longer than 11 characters"],
      },
      description: {
        type: String,
        maxLength: [500, "Description cannot be more than 500 characters long"],
      },
      address: {
        type: String,
        required: [true, "Please add an address"],
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
          index: "2dsphere",
        },
      },
      dateOfBirth: Date,
      image: String,
      resetPasswordToken: String,
      resetPasswordExpire: Date,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    baseOptions
  )
);

module.exports = User;

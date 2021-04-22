const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const baseOptions = {
  discriminatorKey: "usertype", // our discriminator key
  collection: "user", // the name of our collection
};

const UserSchema = new mongoose.Schema(
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
    name: String,
    email: {
      type: String,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please add a valid email here",
      ],
      required: [true, "Please add an email"]
    },
    phone: {
      type: String,
      maxLength: [11, "Phone number cannot be longer than 11 characters"],
    },
    description: {
      type: String,
      maxLength: [500, "Description cannot be more than 500 characters long"],
    },
    address: String,
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
    image: {
      type: String,
      default: "no-photo.jpg",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    communities: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Community",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
      },
    ],
  },
  baseOptions
);

// Encrypt password using bcryptjs
// we want to encrypt before we save the data to the database
UserSchema.pre("save", async function (next) {
  // check to see if we modified the password or not, if not move on to the next middleware
  if (!this.isModified("password")) {
    next();
  }

  // do the following operation if we modify the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed pass in db
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // here this is the object that will call this
};

module.exports = mongoose.model("User", UserSchema);

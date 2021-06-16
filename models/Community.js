const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: String,
  isPrivate: Boolean,
  description: String,
  image: {
    type: String,
    default: 'no-photo.jpg',
  },
  tags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Disease',
    },
  ],
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  about: {
    detailedDescription: String,
    symptoms: [{ type: String }],
    toDo: [{ type: String }],
    images: [
      {
        type: String,
        default: 'no-photo.jpg',
      },
    ],
    links: [
      {
        link: String,
        title: String,
      },
    ],
  },
});

module.exports = mongoose.model('Community', CommunitySchema);

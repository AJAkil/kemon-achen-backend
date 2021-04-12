const mongoose = require('mongoose');

const Tag = mongoose.model(
    'Tag',
    new mongoose.Schema({
        title: String,
        description: String
    })
);

module.exports = Tag
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title can not be empty'],
  },
  body: {
    type: String,
    required: [true, 'Body can not be empty'],
  },
  upVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  downVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Post must belong to a user'],
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
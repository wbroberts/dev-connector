const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  date: {
    type: Date,
    default: Date.now
  },
  body: {
    type: String,
    required: true
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

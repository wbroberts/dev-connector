const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      like: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
      }
    }
  ],
  comments: [
    {
      comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    }
  ]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

const { ObjectID } = require('mongodb');

// Load Models
const Post = require('../../../models/Post');

const Comment = require('../../../models/Comment');
const commentValidation = require('../../../validation/commentValidation');

// Creates a comment and saves it to Comment db
// and then adds it to the Post comments array.
const addComment = (req, res) => {
  const { errors, isValid } = commentValidation(req.body);
  const postID = req.params.postId;

  if (!ObjectID.isValid(postID)) {
    errors.id = 'Not a valid ID';
    return res.status(400).json({ errors });
  }

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const newComment = new Comment({
    post: postID,
    user: req.user.id,
    body: req.body.body,
    name: req.user.name,
    avatar: req.user.avatar
  });

  newComment
    .save()
    .then(comment => {
      return Post.findByIdAndUpdate(
        postID,
        { $push: { comments: { comment } } },
        { new: true }
      ).populate('comments.comment');
    })
    .then(post => res.status(201).json({ post }))
    .catch(() => res.status(400).json({ errors }));
};

// Removes comment from Comment db and then
// removes it from the Post comments array.
const removeComment = (req, res) => {
  const errors = {};
  const postID = req.params.postId;
  const commentID = req.params.commentId;

  if (!ObjectID.isValid(postID) || !ObjectID.isValid(commentID)) {
    errors.id = 'Not a valid ID';
    return res.status(400).json({ errors });
  }

  Comment.findById(commentID)
    .then(comment => {
      // Make sure that the authenticated user is the owner of the comment
      if (comment.user.toString() !== req.user.id) {
        errors.authorization = 'You are not authorized to delete that comment';
        throw Error();
      }

      return comment.remove();
    })
    .then(() => {
      return Post.findByIdAndUpdate(
        postID,
        { $pull: { comments: { comment: commentID } } },
        { new: true }
      ).populate('comments.comment');
    })
    .then(post => res.status(200).json({ post }))
    .catch(() => res.status(400).json({ errors }));
};

module.exports = {
  addComment,
  removeComment
};

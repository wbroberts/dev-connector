const { ObjectID } = require('mongodb');

// Load Models
const Post = require('../../../models/Post');
const Profile = require('../../../models/Profile');

const Comment = require('../../../models/Comment');
// Load functions
const postValidation = require('../../../validation/postValidation');

const addNewPost = (req, res) => {
  const { errors, isValid } = postValidation(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const { text } = req.body;
  const { name, avatar, id } = req.user;

  // Create the new post from the request
  const newPost = new Post({
    text,
    name,
    avatar,
    user: id
  });

  newPost
    .save()
    .then(post => {
      res.status(201).json({ post });
    })
    .catch(() => {
      res.status(400).json({ error: 'Something went wrong' });
    });
};

const getAllPosts = (req, res) => {
  const errors = {};

  Post.find({})
    .sort({ date: -1 })
    .then(posts => {
      if (!posts) {
        errors.posts = 'No posts found';
        throw Error();
      }

      res.status(200).json({ totalPosts: posts.length, posts });
    })
    .catch(() => res.status(404).json({ errors }));
};

const getOnePostById = (req, res) => {
  const errors = {};
  const postID = req.params.id;

  if (!ObjectID.isValid(postID)) {
    errors.id = 'Not a valid ID';
    return res.status(400).json({ errors });
  }

  Post.findById(postID)
    .populate('likes.like')
    .then(post => {
      if (!post) {
        errors.post = 'No post found';
        throw Error();
      }

      res.status(200).json({ post });
    })
    .catch(() => {
      res.status(404).json({ errors });
    });
};

const removePostById = (req, res) => {
  const errors = {};
  const postID = req.params.id;

  if (!ObjectID.isValid(postID)) {
    errors.id = 'Not a valid ID';
    return res.status(400).json({ errors });
  }

  // Make sure it is an authorized user
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(postID)
      .then(post => {
        // Check to see if it is a post created by the user
        // return an error
        if (post.user.toString() !== req.user.id) {
          errors.authorization = 'Unauthorized';
          return res.status(401).json({ errors });
        }

        post.remove().then(() => res.status(200).json({ success: true }));
      })
      .catch(() => {
        errors.post = 'No post found';
        res.status(404).json({ errors });
      });
  });
};

module.exports = {
  addNewPost,
  getAllPosts,
  getOnePostById,
  removePostById
};

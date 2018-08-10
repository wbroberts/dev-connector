const { ObjectID } = require('mongodb');

// Load Models
const Post = require('../../../models/Post');
const Like = require('../../../models/Like');

const likePost = (req, res) => {
  const errors = {};
  const postID = req.params.postId;
  const user = req.user.id;

  if (!ObjectID.isValid(postID)) {
    errors.id = 'Not a valid ID';
    return res.status(400).json({ errors });
  }

  // First search to see if the post is already liked by the user
  // which would be stored in the likes. If it is, then error, else
  // it creates the like and adds it to the post.
  Like.findOne({ post: postID, user })
    .then(like => {
      if (like) {
        errors.like = 'User already liked this post';
        throw Error();
      }

      const newLike = new Like({ post: postID, user });
      return newLike.save();
    })
    .then(like => {
      return Post.findByIdAndUpdate(
        postID,
        { $push: { likes: { like } } },
        { new: true }
      );
    })
    .then(post => res.status(200).json({ post }))
    .catch(() => res.status(400).json({ errors }));
};

// Removes like from Like db and then updates
// the Post likes array
const unlikePost = (req, res) => {
  const errors = {};
  const postID = req.params.postId;
  const user = req.user.id;

  if (!ObjectID.isValid(postID)) {
    errors.id = 'Not a valid ID';
    return res.status(400).json({ errors });
  }

  Like.findOneAndRemove({ post: postID, user })
    .then(like => {
      return Post.findByIdAndUpdate(
        postID,
        { $pull: { likes: { like: like._id } } },
        { new: true }
      );
    })
    .then(post => res.status(200).json({ post }))
    .catch(() => res.status(400).json({ errors }));
};

module.exports = {
  likePost,
  unlikePost
};

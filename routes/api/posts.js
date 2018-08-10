const router = require('express').Router();
const passport = require('passport');

const {
  addNewPost,
  getAllPosts,
  getOnePostById,
  removePostById
} = require('./helpers/posts-helpers');
const { likePost, unlikePost } = require('./helpers/like-helpers');
const { addComment, removeComment } = require('./helpers/comment-helpers');

router.route('/test').get((req, res) => {
  res.json({ message: 'this is from the post route' });
});

// ROUTE    /api/posts
// DESC     Adds/creates a post
// METHODS  POST, GET
// ACCESS   Private (POST) & Public (GET)
router
  .route('/')
  .post(passport.authenticate('jwt', { session: false }), addNewPost)
  .get(getAllPosts);

// ROUTE    /api/posts/:id
// DESC     Gets one post by its ID
// METHODS  GET, DELETE
// ACCESS   Private (DELETE) & Public (GET)
router
  .route('/:id')
  .get(getOnePostById)
  .delete(passport.authenticate('jwt', { session: false }), removePostById);

// ROUTE    /api/posts/like/:postId
// DESC     Likes and unlikes posts
// METHODS  POST, DELETE
// ACCESS   Private
router
  .route('/like/:postId')
  .post(passport.authenticate('jwt', { session: false }), likePost)
  .delete(passport.authenticate('jwt', { session: false }), unlikePost);

// ROUTE    /api/posts/comment/:postId
// DESC     Adds a comment to a post
// METHODS  POST
// ACCESS   Private
router
  .route('/comment/:postId')
  .post(passport.authenticate('jwt', { session: false }), addComment);

// ROUTE    /api/posts/comment/:postId/:commentId
// DESC     Removes a comment from a post
// METHODS  DELETE
// ACCESS   Private
router
  .route('/comment/:postId/:commentId')
  .delete(passport.authenticate('jwt', { session: false }), removeComment);

module.exports = router;

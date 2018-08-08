const router = require('express').Router();
const passport = require('passport');

const {
  addNewPost,
  getAllPosts,
  getOnePostById,
  removePostById,
  likeAndUnlikePost
} = require('./helpers/posts-helpers');

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

router
  .route('/like/:id')
  .post(passport.authenticate('jwt', { session: false }), likeAndUnlikePost);

module.exports = router;

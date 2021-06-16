const express = require('express');
const {
  signupRegularUser,
  signupProfessionalUser,
  login,
  getMe,
  getUserPosts,
  getUserComments,
  getUserCommunities,
  joinCommunity,
  getSavedPosts,
} = require('../controllers/user');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/regular/signup', signupRegularUser);
router.post('/professional/signup', signupProfessionalUser);
router.post('/login', login);

router.get('/:userid/posts', protect, getUserPosts);
router.get('/:userid/comments', protect, getUserComments);
router.get('/communities', protect, getUserCommunities);
router.get('/community/:communityId/join', protect, joinCommunity);
router.get('/savedPosts', protect, getSavedPosts);

module.exports = router;

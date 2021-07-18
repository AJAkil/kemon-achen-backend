const express = require('express');
const {
  signupRegularUser,
  signupProfessionalUser,
  login,
  getUserPosts,
  getUserComments,
  getUserCommunities,
  joinCommunity,
  getSavedPosts,
  getUserTestHistory,
  getProfessionalInformation,
  getProfessionalChamberInformation,
  getSuggestedProfessionals,
} = require('../controllers/user');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/regular/signup', signupRegularUser);
router.post('/professional/signup', signupProfessionalUser);
router.post('/login', login);

router.get('/:userid/posts', protect, getUserPosts);
router.get('/:userid/comments', protect, getUserComments);
router.get('/tests/history', protect, getUserTestHistory);
router.get('/communities', protect, getUserCommunities);
router.get('/community/:communityId/join', protect, joinCommunity);
router.get('/savedPosts', protect, getSavedPosts);
router.get('/professional/:userid/info', protect, getProfessionalInformation);
router.get(
  '/professional/:userid/chamber',
  protect,
  getProfessionalChamberInformation,
);
router.get('/suggesetedProfessionals', protect, getSuggestedProfessionals);

module.exports = router;

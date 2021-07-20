const express = require('express');
const {
  signupRegularUser,
  signupProfessionalUser,
  login,
  registerPushNotificationToken,
  getUserPosts,
  getUserComments,
  getUserCommunities,
  joinCommunity,
  getSavedPosts,
  getUserTestHistory,
  getProfessionalInformation,
  getProfessionalChamberInformation,
  getLatestAdvices,
  logOut,
  getSuggestedProfessionals,
  getUserNotifications,
} = require('../controllers/user');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/regular/signup', signupRegularUser);
router.post('/professional/signup', signupProfessionalUser);
router.post('/login', login);
router.post('/logout', protect, logOut);
router.post('/pushToken/register', protect, registerPushNotificationToken);

router.get('/:userid/posts', protect, getUserPosts);
router.get('/notifications', protect, getUserNotifications);
router.get('/advice/latest', protect, getLatestAdvices);
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

const express = require('express');
const {
  getCommunityInformation,
  getCommunityFeed,
  updateAbout,
  getCommunityAbout,
  searchCommunityPosts,
} = require('../controllers/community');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/:communityId/information', protect, getCommunityInformation);
router.get('/:communityId/feed', protect, getCommunityFeed);
router.get('/:communityId/about', protect, getCommunityAbout);
router.get('/:communityId/postSearch', protect, searchCommunityPosts);

router.post('/:communityId/updateAbout', protect, updateAbout);
module.exports = router;

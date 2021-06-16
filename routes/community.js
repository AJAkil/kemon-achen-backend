const express = require('express');
const {
  getCommunityInformation,
  getCommunityFeed,
  updateAbout,
  getCommunityAbout,
} = require('../controllers/community');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/:communityId/information', protect, getCommunityInformation);
router.get('/:communityId/feed', protect, getCommunityFeed);
router.post('/:communityId/updateAbout', protect, updateAbout);
router.get('/:communityId/about', protect, getCommunityAbout);

module.exports = router;

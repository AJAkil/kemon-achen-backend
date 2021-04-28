const express = require("express");
const { savePost, likePost } = require("../controllers/post");

const router = express.Router();
const { protect } = require("../middleware/auth");

router.get("/:postId/save", protect, savePost);
router.get("/:postId/like", protect, likePost);

module.exports = router;

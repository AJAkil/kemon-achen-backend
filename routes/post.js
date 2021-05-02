const express = require('express');
const {
  savePost,
  likePost,
  createPost,
  createComment,
  createReply,
  getRepliesOfComment
} = require("../controllers/post");

const router = express.Router();
const { protect } = require('../middleware/auth');

router.get("/:postId/save", protect, savePost);
router.get("/:postId/like", protect, likePost);
router.get("/:postId/comment/:commentId/replies", protect, getRepliesOfComment);

router.post('/create', protect, createPost);
router.post('/:postId/comment/create', protect, createComment);
router.post('/:postId/comment/:commentId/reply/create', protect, createReply);

module.exports = router;

const express = require("express");
const { signupRegularUser, signupProfessionalUser, login, getMe } = require("../controllers/user");

const router = express.Router();
const { protect } = require("../middleware/auth");

router.post("/regular/signup", signupRegularUser);
router.post("/professional/signup", signupProfessionalUser);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;

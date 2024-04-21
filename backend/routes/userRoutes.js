const express = require("express");
const { signupUser, loginUser, allUsers } = require('../controllers/userController');
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// router.post('/signup', signupUser);
router.route("/").post(signupUser);
router.post('/login', loginUser);
router.route('/').get(protect, allUsers);

module.exports = router;
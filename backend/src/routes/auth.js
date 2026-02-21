const express = require('express');
const router = express.Router();
const { registerStudent, registerLecturer, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register/student', registerStudent);
router.post('/register/lecturer', registerLecturer);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;

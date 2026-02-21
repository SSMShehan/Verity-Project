const express = require('express');
const router = express.Router();
const { getYears, getSemestersByYear, getAllModules } = require('../controllers/academicController');

// Public routes for registration forms
router.get('/years', getYears);
router.get('/years/:yearId/semesters', getSemestersByYear);
router.get('/modules', getAllModules);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getYears, getSemestersByYear, getAllModules, getModuleDetails, createModule } = require('../controllers/academicController');

// Public routes for registration forms
router.get('/years', getYears);
router.get('/years/:yearId/semesters', getSemestersByYear);
router.get('/modules', getAllModules);
router.get('/modules/:id', getModuleDetails);
router.post('/modules', createModule);

module.exports = router;

const express = require('express');
const { generateTravelPlan, modifyTravelPlan } = require('../controllers/planController');

const router = express.Router();

router.post('/generate', generateTravelPlan);
router.post('/modify', modifyTravelPlan);

module.exports = router;
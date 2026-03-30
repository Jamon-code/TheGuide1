const express = require('express');
const { addService } = require('../controllers/serviceController');

const router = express.Router();

router.post('/add', addService);

module.exports = router;
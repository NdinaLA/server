const express = require('express');
const router = express.Router();
const data = require('../controllers/data.controller');

router.get('/all', data.getData);

module.exports = router;

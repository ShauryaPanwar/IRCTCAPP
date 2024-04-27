const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin Registration
router.post('/register', adminController.register);

// Add New Train
router.post('/trains', adminController.addTrain);

module.exports = router;

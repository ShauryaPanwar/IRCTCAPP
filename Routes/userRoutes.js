const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User Registration
router.post('/register', userController.register);

// User Login
router.post('/login', userController.login);

// Get Seat Availability
router.get('/availability', userController.getSeatAvailability);

// Book a Seat
router.post('/book', userController.bookSeat);

// Get Specific Booking Details
router.get('/booking/:bookingId', userController.getBookingDetails);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/isAuthenticated');

// Login route
router.post('/login', authController.login);

// Logout route (requires authentication)
router.post('/logout', isAuthenticated, authController.logout);

// Check authentication status
router.get('/check', authController.checkAuth);

module.exports = router;


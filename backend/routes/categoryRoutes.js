const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const isAuthenticated = require('../middleware/isAuthenticated');

// All category routes require authentication
router.use(isAuthenticated);

// Routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;


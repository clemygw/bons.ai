const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Create new user
router.post('/', userController.createUser);

// Get all users
router.get('/', userController.getUsers);

// Get single user
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;

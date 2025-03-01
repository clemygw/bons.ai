const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');

// Get all transactions for a user
router.get('/user/:userId', transactionController.getUserTransactions);

// Create a new transaction for a user
router.post('/user/:userId', transactionController.createTransaction);

// Get a specific transaction
router.get('/:transactionId', transactionController.getTransaction);

// Update a transaction
router.put('/:transactionId', transactionController.updateTransaction);

// Delete a transaction
router.delete('/:transactionId', transactionController.deleteTransaction);

module.exports = router; 
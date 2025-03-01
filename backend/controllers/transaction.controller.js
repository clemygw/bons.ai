const Transaction = require('../models/Transaction.model');
const User = require('../models/User.model');

const transactionController = {
  // Get all transactions for a user
  getUserTransactions: async (req, res) => {
    try {
      const userId = req.params.userId;
      const transactions = await Transaction.find({ user: userId })
        .sort({ date: -1 });
      
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new transaction
  createTransaction: async (req, res) => {
    try {
      // Create new transaction with user ID from params
      const newTransaction = new Transaction({
        ...req.body,
        user: req.params.userId
      });

      const savedTransaction = await newTransaction.save();
      
      // Update user's transactions array by pushing the new transaction ID
      await User.findByIdAndUpdate(
        req.params.userId,
        { $push: { transactions: savedTransaction._id } }
      );

      res.status(201).json(savedTransaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get a specific transaction
  getTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.transactionId);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a transaction
  updateTransaction: async (req, res) => {
    try {
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.transactionId,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.status(200).json(updatedTransaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a transaction
  deleteTransaction: async (req, res) => {
    try {
      await Transaction.findByIdAndDelete(req.params.transactionId);
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteMultipleTransactions: async (req, res) => {
    try {
      const { transactionIds } = req.body;
      await Transaction.deleteMany({ _id: { $in: transactionIds } });
      res.status(200).json({ message: 'Transactions deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = transactionController; 
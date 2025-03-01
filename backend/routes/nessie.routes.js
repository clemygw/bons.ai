const express = require('express');
const { getAccounts, getTransactions } = require('../controllers/nessie.controllers.js');

const router = express.Router();

router.get('/accounts', getAccounts);  // Fetch all accounts
router.get('/transactions/:accountId', getTransactions);  // Fetch transactions for an account

module.exports = router;
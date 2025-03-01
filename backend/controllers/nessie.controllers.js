const axios = require('axios');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();

const NESSIE_API_KEY = process.env.NESSIE_API_KEY;
const BASE_URL = 'http://api.nessieisreal.com';
const ID = '56c66be6a73e492741507b34';

// @desc    Get filtered transactions
// @route   GET /api/nessie/transactions
// @access  Public
const getTransactions = asyncHandler(async (req, res) => {
  try {
    const { accountId } = req.params;
    const response = await axios.get(`${BASE_URL}/enterprise/transfers?key=${NESSIE_API_KEY}`);

    if (response.data) {
      // Debug logs to understand the data structure
      
      // Simplified filter to only check payer_id
      const filtered = response.data.results.filter(transaction => {
        console.log('Checking transaction:', transaction); // Debug each transaction
        //console.log(transaction[0])
        console.log('Comparing payer_id:', transaction.payer_id, 'with accountId:', accountId);
        return transaction.payer_id === accountId;
      });
      
      console.log('Filtered transactions:', filtered); // Debug filtered results
      res.json(filtered);
    } else {
      res.status(404);
      throw new Error('No transactions found');
    }
  } catch (error) {
    console.error('Error fetching Nessie transactions:', error.message);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

function filterTransactions(transactions,payer_id) {
    return transactions.filter(transaction => transaction.payer_id === payer_id);
}

// @desc    Get all accounts
// @route   GET /api/nessie/accounts
// @access  Public
const getAccounts = asyncHandler(async (req, res) => {
    try {
      console.log('NESSIE_API_KEY:', `${NESSIE_API_KEY}`);
      const response = await axios.get(`${BASE_URL}/enterprise/accounts?key=${NESSIE_API_KEY}`);
      console.log('Response:', response.data); // Add logging to debug
      if (response.data) {
        res.json(response.data);
      } else {
        res.status(404);
        throw new Error('No accounts found');
      }
    } catch (error) {
      console.error('Error fetching Nessie accounts:', error.message);
      res.status(500).json({ message: 'Error fetching accounts' });
    }
  });

module.exports = {
    getTransactions,
    getAccounts
};

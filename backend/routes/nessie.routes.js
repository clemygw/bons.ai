import express from 'express';
import { getAccounts, getTransactions } from '../controllers/nessie.controllers.js';

const router = express.Router();

router.get('/accounts', getAccounts);  // Fetch all accounts
router.get('/transactions/:accountId', getTransactions);  // Fetch transactions for an account

export default router;
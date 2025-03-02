"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "./Icons"
import axios from "axios"
import { motion } from "framer-motion"

async function getTransactions(accountId) {
  try{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/nessie/transactions/${accountId}`);
    console.log("Getting all transactions for account", accountId);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching transactions:', error);
    return []; 
  }
}

async function checkExistingTransactions(userId) {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions/user/${userId}`);
    return response.data.length > 0;
  } catch (error) {
    console.error('Error checking existing transactions:', error);
    return false;
  }
}

async function postTransactions(userId, transactions) {
  try {
    const hasExistingTransactions = await checkExistingTransactions(userId);
    
    if (hasExistingTransactions) {
      console.log('User already has transactions, skipping import');
      return [];
    }
    const promises = transactions.map(transaction => {
      const formattedTransaction = {
        amount: transaction.amount,
        date: new Date(new Date().setHours(0, 0, 0, 0)),
        description: transaction.description || 'Nessie Transaction',
        type: transaction.type || 'transfer',
        user: userId,
        category: "grocery",
        merchant: "Walmart"
        // Add any other fields your Transaction model requires
      };
      
      console.log('Transaction date:', formattedTransaction.date.toISOString());  // This will show the exact date being used
      
      return axios.post(`${import.meta.env.VITE_API_URL}/api/transactions/user/${userId}`, formattedTransaction);
    });
    
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error posting transactions:', error);
    throw error;
  }
}

const LoginForm = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await onSubmit({ email, password, rememberMe });
      if (loginResponse && loginResponse.user && loginResponse.user.id) {
        // Get transactions from Nessie - using a fixed account ID for now
        // In production, you would use the user's actual account ID
        const transactions = await getTransactions("66ef229b9683f20dd518a02a"); //TEMPORARILY REMOVING THIS SINCE NESSIE MATCHING USER ID IS NOT WORKING
        
        if (transactions.length > 0) {
          // Post transactions to your backend and link them to the user
          await postTransactions(loginResponse.user.id, transactions);
          
          // Note: The backend should handle adding the transaction IDs to the user's transactions array
          // This happens in your createTransaction controller where you do:
          // await User.findByIdAndUpdate(req.params.userId, { $push: { transactions: savedTransaction._id } });
        }
      } else {
        console.log("Login failed. loginResponse:", loginResponse.user);
      }
    } catch (error) {
      console.error('Error during login process:', error);
    }
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
          placeholder="Enter your email"
        />
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
            placeholder="Enter your password"
          />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600"
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        className="flex items-center justify-between"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <motion.a 
          href="/forgot-password" 
          className="text-sm font-medium text-teal-600 hover:text-emerald-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Forgot password?
        </motion.a>
      </motion.div>

      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </motion.button>
    </motion.form>
  )
}

export default LoginForm


"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "./Icons"
import axios from "axios"

const API_URL = 'http://localhost:5001/api';

async function getTransactions(accountId) {
  try{
    const response = await axios.get(`${API_URL}/nessie/transactions/${accountId}`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching transactions:', error);
    return []; 
  }
}
async function checkExistingTransactions(userId) {
  try {
    const response = await axios.get(`${API_URL}/transactions/user/${userId}`);
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
        date: new Date(transaction.transaction_date),
        description: transaction.description || 'Nessie Transaction',
        type: transaction.type || 'transfer',
        user: userId,
        category: "dining",
        merchant: "Walmart"
        // Add any other fields your Transaction model requires
      };
      
      return axios.post(`${API_URL}/transactions/user/${userId}`, formattedTransaction);
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
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, handle the login
      //const loginResponse = await onSubmit({ username, password, company, rememberMe });
      const transactions = await getTransactions("66ef229b9683f20dd518a02a");
        
      if (transactions.length > 0) {
        // Post transactions to your backend
        await postTransactions("67c2c6f00ed06018206e0c9c", transactions);
      }
      // Assuming loginResponse contains the user data including ID and account ID
      // if (loginResponse && loginResponse.userId) {
      //   // Get transactions from Nessie
      //   const transactions = await getTransactions(loginResponse.accountId);
        
      //   if (transactions.length > 0) {
      //     // Post transactions to your backend
      //     await postTransactions(loginResponse.userId, transactions);
      //   }
      // }
      await Promise.all([getTransactions, postTransactions]); // Add this line to ensure all async operations are complete
      //router.push("/dashboard");
    } catch (error) {
      console.error('Error during login process:', error);
      // Handle error appropriately
    }
    onSubmit({ email, password, company, rememberMe })
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
          placeholder="Enter your username"
        />
      </div>

      <div>
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name (Optional)
        </label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
          placeholder="Enter your company name"
        />
      </div>

      <div className="flex items-center justify-between">
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
        <a href="/forgot-password" className="text-sm font-medium text-teal-600 hover:text-teal-800">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
      </button>
    </form>
  )
}

export default LoginForm


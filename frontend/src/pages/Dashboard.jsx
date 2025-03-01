"use client"
import { useState, useEffect, useMemo } from "react"
import { User, Bell } from "lucide-react"
import DevSidebar from "../components/DevSidebar"
import TopBar from "../components/TopBar"
import { useAuth } from "../context/AuthContext"
import { useCompany } from "../context/CompanyContext"
import axios from 'axios'
import Layout from "../components/Layout"

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const { user } = useAuth()
  const { company } = useCompany()

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.transactions) {
        console.log('Fetching transactions from user...');
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/user/${user.id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Transactions data received:', data);
          setTransactions(data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
          setTransactions([]);
        }
      }
    };

    fetchTransactions();
  }, [user]);

  const { categoryEmissions, totalEmissions } = useMemo(() => {
    const categories = {
      dining: 0,
      transportation: 0,
      grocery: 0,
      retail: 0,
      other: 0
    }
    
    let total = 0
    
    transactions.forEach(transaction => {
      const category = transaction.category.toLowerCase()
      if (categories.hasOwnProperty(category)) {
        categories[category] += transaction.co2Emissions
      } else {
        categories.other += transaction.co2Emissions
      }
      
      total += transaction.co2Emissions
    })
    
    const sortedCategoryEmissions = Object.entries(categories)
      .map(([name, emissions]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        emissions,
        percentage: total > 0 ? Math.round((emissions / total) * 100) : 0
      }))
      .sort((a, b) => b.emissions - a.emissions)
    
    return {
      categoryEmissions: sortedCategoryEmissions,
      totalEmissions: total
    }
  }, [transactions])

  const handleTransactionClick = (transactionId) => {
    const transaction = transactions.find(t => t._id === transactionId)
    setSelectedTransaction(transaction)
  }

  return (
    <Layout>
      <div className="grid grid-cols-3 gap-8">
        {/* Main Box (2/3) */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Carbon Emissions by Category</h2>
            
            {/* Total Emissions Bar */}
            <div className="mb-8 space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Total Emissions</span>
                <span>{totalEmissions} kg CO₂</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            
            {/* Category Emissions - Sorted by size */}
            <div className="space-y-6">
              {categoryEmissions.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span>{category.emissions} kg CO₂ ({category.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List (1/3) */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <button
                key={transaction._id}
                onClick={() => handleTransactionClick(transaction._id)}
                className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{transaction.merchant}</h3>
                    <p className="text-sm text-gray-600">{transaction.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${transaction.amount}</p>
                    <p className="text-sm text-gray-600">{transaction.co2Emissions} kg CO₂</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Merchant</p>
                <p className="font-medium">{selectedTransaction.merchant}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">${selectedTransaction.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{selectedTransaction.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Carbon Emissions</p>
                <p className="font-medium">{selectedTransaction.co2Emissions} kg CO₂</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Items</p>
                {selectedTransaction.items.map(item => (
                  <div key={item.name}>
                    <p className="font-medium">{item.name} - ${item.price} x {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedTransaction(null)}
              className="mt-6 w-full py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Dashboard


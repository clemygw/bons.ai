"use client"

import { useState } from "react"
import { User, Bell } from "lucide-react"
import DevSidebar from "../components/DevSidebar"

// Mock data for development
const mockCategories = [
  { name: "Dining", percentage: 45, emissions: 250 },
  { name: "Transportation", percentage: 30, emissions: 180 },
  { name: "Groceries", percentage: 25, emissions: 120 },
  { name: "Retail", percentage: 20, emissions: 100 },
  { name: "other", percentage: 15, emissions: 80 },

]

// Mock data for transactions
const mockTransactions = [
  {
    _id: "1",
    amount: 75.5,
    category: "grocery",
    merchant: "Whole Foods",
    date: "2024-02-20",
    co2Emissions: 15,
    items: [
      { name: "Apples", price: 3.5, quantity: 2 },
      { name: "Bread", price: 2.0, quantity: 1 },
    ],
  },
  {
    _id: "2",
    amount: 25.0,
    category: "rideshare",
    merchant: "Uber",
    date: "2024-02-19",
    co2Emissions: 8,
    items: [
      { name: "Ride to work", price: 25.0, quantity: 1 },
    ],
  },
  {
    _id: "3",
    amount: 12.5,
    category: "dining",
    merchant: "Chipotle",
    date: "2024-02-18",
    co2Emissions: 5,
    items: [
      { name: "Burrito", price: 10.0, quantity: 1 },
      { name: "Drink", price: 2.5, quantity: 1 },
    ],
  },
]

const Dashboard = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const handleTransactionClick = (transactionId) => {
    const transaction = mockTransactions.find(t => t._id === transactionId)
    setSelectedTransaction(transaction)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DevSidebar />

      {/* Top Bar */}
      <div className="ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-600">bons.ai</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Acme Corp</span>
              <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Main Box (2/3) */}
            <div className="col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Carbon Emissions by Category</h2>
                <div className="space-y-6">
                  {mockCategories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span>{category.emissions} kg CO₂</span>
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
                {mockTransactions.map((transaction) => (
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
        </main>
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
    </div>
  )
}

export default Dashboard


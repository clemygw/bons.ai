"use client"

import { useState } from "react"
import DevSidebar from "../components/DevSidebar"
import TopBar from "../components/TopBar"
import { Camera } from "lucide-react"
import useGrowTree from "../hooks/useGrowTree" // Import the custom hook
import { useCompany } from "../context/CompanyContext"
import Layout from "../components/Layout"

// Mock unrecorded transactions
const initialTransactions = [
  {
    _id: "1",
    merchant: "Whole Foods",
    amount: 75.5,
    date: "2024-02-20",
    category: "grocery",
  },
  {
    _id: "2",
    merchant: "Uber",
    amount: 25.0,
    date: "2024-02-19",
    category: "transportation",
  },
  {
    _id: "3",
    merchant: "Chipotle",
    amount: 12.5,
    date: "2024-02-18",
    category: "dining",
  },
].sort((a, b) => new Date(a.date) - new Date(b.date))

const Garden = () => {
  const { company } = useCompany()
  const { carbonSaved, growTree } = useGrowTree(50) // Use the custom hook
  const [transactions, setTransactions] = useState(initialTransactions)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  // Calculate the height of the tree based on carbon saved
  const treeHeight = Math.min(100 + (carbonSaved / 1) * 200, 300); // Max height of 300px
  const treeBaseY = 400; // Y position for the bottom of the tree

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
    setShowCamera(true)
  }

  const handleCloseCamera = () => {
    setShowCamera(false)
    if (selectedTransaction) {
      setTransactions(transactions.filter((t) => t._id !== selectedTransaction._id))
      setSelectedTransaction(null)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-100">
        <div className="ml-16 relative h-screen">
          {/* Button to grow the tree */}
          <button
            onClick={growTree}
            className="absolute top-4 right-4 px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-colors"
          >
            Grow Tree
          </button>

          {/* Horizon Line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-green-600" />

          {/* Bonsai Tree */}
          <div
            className="absolute left-1/2 transition-all duration-1000"
            style={{
              width: `${treeHeight}px`,
              height: `${treeHeight}px`,
              transform: `translate(-50%, ${treeBaseY - treeHeight}px)`, // Keep the bottom of the tree at the same Y position
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M50 90 L50 60 M30 60 Q50 20 70 60 Z"
                fill="#0d9488"
                stroke="#0d9488"
                strokeWidth="2"
                className="transition-all duration-1000"
              />
              <rect x="45" y="90" width="10" height="20" fill="#854d0e" />
            </svg>
          </div>

          {/* Carbon Saved Indicator */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-semibold text-teal-600">Carbon Saved</h2>
            <p className="text-3xl font-bold">{carbonSaved} kg CO₂</p>
          </div>

          {/* Unrecorded Transactions */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Unrecorded Transactions</h3>
              <div className="grid gap-3">
                {transactions.map((transaction) => (
                  <button
                    key={transaction._id}
                    onClick={() => handleTransactionClick(transaction)}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-100 rounded-full">
                        <Camera size={20} className="text-teal-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{transaction.merchant}</p>
                        <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Camera Modal */}
          {showCamera && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
                <p className="text-gray-600 mb-4">
                  Please take a photo of your receipt for {selectedTransaction?.merchant}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCloseCamera}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCloseCamera}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Garden


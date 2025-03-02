"use client"

import React from "react"
import { useState, useEffect, useMemo } from "react"
import { Camera } from "../components/Icons"
import { useAuth } from "../context/AuthContext"
import { useCompany } from "../context/CompanyContext"
import Card from "../components/Card"
import Button from "../components/Button"
import Modal from "../components/Modal"
import { motion } from "framer-motion"
import TopBar from "../components/TopBar"
import DevSidebar from "../components/DevSidebar"

interface Transaction {
  _id: string
  merchant: string
  amount: number
  date: string
  category: string
  co2Emissions: number
  receiptUploaded?: boolean
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [receiptedTransactions, setReceiptedTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const { user } = useAuth()
  const { company } = useCompany()
  const [insights, setInsights] = useState<{ insights: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.transactions) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/user/${user.id}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          
          // Set all transactions
          setTransactions(data)
          
          // Filter transactions with receipts uploaded
          const receipted = data.filter((t: Transaction) => t.receiptUploaded === true)
          setReceiptedTransactions(receipted)
          
          // Log transaction details for debugging
          console.log(`Total transactions: ${data.length}`)
          console.log(`Transactions with receipts: ${receipted.length}`)
          console.log('Receipted transactions:', receipted.map(t => ({
            id: t._id,
            merchant: t.merchant,
            amount: t.amount,
            date: new Date(t.date).toLocaleDateString()
          })))
        } catch (error) {
          console.error("Error fetching transactions:", error)
          setTransactions([])
          setReceiptedTransactions([])
        }
      }
    }

    fetchTransactions()
  }, [user])

  const { categoryEmissions, totalEmissions } = useMemo(() => {
    const categories: Record<string, number> = {
      dining: 0,
      transportation: 0,
      grocery: 0,
      retail: 0,
      other: 0,
    }

    let total = 0

    transactions.forEach((transaction) => {
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
        percentage: total > 0 ? Math.round((emissions / total) * 100) : 0,
      }))
      .sort((a, b) => b.emissions - a.emissions)

    return {
      categoryEmissions: sortedCategoryEmissions,
      totalEmissions: total,
    }
  }, [transactions])

  const { categorySpending, totalSpending } = useMemo(() => {
    const categories: Record<string, number> = {
      dining: 0,
      transportation: 0,
      grocery: 0,
      retail: 0,
      other: 0,
    }

    let total = 0

    transactions.forEach((transaction) => {
      const category = transaction.category.toLowerCase()
      if (categories.hasOwnProperty(category)) {
        categories[category] += transaction.amount
      } else {
        categories.other += transaction.amount
      }

      total += transaction.amount
    })

    const sortedCategorySpending = Object.entries(categories)
      .map(([name, spending]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        spending,
        percentage: total > 0 ? Math.round((spending / total) * 100) : 0,
      }))
      .sort((a, b) => b.spending - a.spending)

    return {
      categorySpending: sortedCategorySpending,
      totalSpending: total,
    }
  }, [transactions])

  const handleTransactionClick = (transactionId: string) => {
    const transaction = transactions.find((t) => t._id === transactionId)
    if (transaction) {
      setSelectedTransaction(transaction)
    }
  }

  const handleCloseModal = () => {
    setSelectedTransaction(null)
  }

  return (
    <div className="flex">
      <DevSidebar />
      <div className="flex-1">
        <TopBar companyName={company?.name}>
          {/* Add empty children prop to fix TypeScript error */}
        </TopBar>
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Carbon Impact Dashboard
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-2">
                {/* Carbon Emissions by Category */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Carbon Emissions by Category</h2>

                    {/* Total Emissions Bar */}
                    <div className="mb-8 space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total Emissions</span>
                        <span>{totalEmissions.toFixed(2)} kg CO₂</span>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Category Emissions - Sorted by size */}
                    <div className="space-y-6">
                      {categoryEmissions.map((category, index) => (
                        <motion.div
                          key={category.name}
                          className="space-y-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex justify-between text-sm">
                            <span>{category.name}</span>
                            <span>
                              {category.emissions.toFixed(2)} kg CO₂ ({category.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${category.percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>

                {/* Spending by Category */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Spending by Category</h2>

                    {/* Total Spending Bar */}
                    <div className="mb-8 space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total Spending</span>
                        <span>${totalSpending.toFixed(2)}</span>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Category Spending - Sorted by size */}
                    <div className="space-y-6">
                      {categorySpending.map((category, index) => (
                        <motion.div
                          key={category.name}
                          className="space-y-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex justify-between text-sm">
                            <span>{category.name}</span>
                            <span>
                              ${category.spending.toFixed(2)} ({category.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${category.percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>

                {/* Generate Spending Insights Button */}
                <motion.button
                  className="mt-6 bg-teal-600 text-white rounded-full px-4 py-2 flex items-center"
                  whileHover={{ scale: 1.02, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={async () => {
                    if (user) {
                      setLoading(true)
                      try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/insights/user-insights/${user.id}`)
                        if (!response.ok) {
                          throw new Error(`HTTP error! status: ${response.status}`)
                        }
                        const insights = await response.json()
                        console.log('Insights:', insights)
                        setInsights(insights)
                      } catch (error) {
                        console.error('Error generating insights:', error)
                      } finally {
                        setLoading(false)
                      }
                    }
                  }}
                >
                  {loading && (
                    <motion.div
                      className="mr-2"
                      style={{
                        border: '2px solid transparent',
                        borderTop: '3px solid #bbbbbb',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    />
                  )}
                  Generate Spending Insights
                </motion.button>
              </div>

              {/* Transactions List (1/3) */}
              <motion.div
                className="col-span-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">
                    Receipted Transactions ({receiptedTransactions.length})
                  </h2>
                  <div className="space-y-4">
                    {receiptedTransactions.length > 0 ? (
                      receiptedTransactions.map((transaction, index) => (
                        <motion.div
                          key={transaction._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <button
                            onClick={() => handleTransactionClick(transaction._id)}
                            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-emerald-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <p className="font-medium">{transaction.merchant}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(transaction.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No transactions with receipts found.
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Transaction Details Modal */}
            <Modal isOpen={!!selectedTransaction} onClose={handleCloseModal}>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Transaction Details
                </h2>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Merchant</p>
                  <p className="font-medium">{selectedTransaction?.merchant}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                  <p className="font-medium">${selectedTransaction?.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium">{selectedTransaction?.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Carbon Emissions</p>
                  <p className="font-medium">{selectedTransaction?.co2Emissions.toFixed(2)} kg CO₂</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-medium">
                    {selectedTransaction?.date && new Date(selectedTransaction.date).toLocaleDateString()}
                  </p>
                </div>

                <Button variant="secondary" onClick={handleCloseModal} className="w-full mt-6">
                  Close
                </Button>
              </div>
            </Modal>

            {/* Insights Modal */}
            <Modal isOpen={!!insights} onClose={() => setInsights(null)}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: insights?.insights || '' }} />
                <Button variant="secondary" onClick={() => setInsights(null)} className="w-full mt-6">
                  Close
                </Button>
              </motion.div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

<style jsx>{`
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>


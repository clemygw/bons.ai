"use client"

import { useState } from "react"
import { Camera } from "../components/Icons"
import useGrowTree from "../hooks/useGrowTree"
import { useCompany } from "../context/CompanyContext"
import { motion, AnimatePresence } from "framer-motion"
import DevSidebar from "../components/DevSidebar"
import TopBar from "../components/TopBar"
import Card from "../components/Card"

interface Transaction {
  _id: string
  merchant: string
  amount: number
  date: string
  category: string
}

const initialTransactions: Transaction[] = [
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
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function Garden() {
  const { company } = useCompany()
  const { carbonSaved } = useGrowTree(50)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const handleTransactionClick = (transaction: Transaction) => {
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
    <div className="flex">
      <DevSidebar />
      <div className="flex-1">
        <TopBar companyName={company?.name} />
        <div className="min-h-[calc(100vh-4rem)] bg-white p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
        <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Carbon Garden
              </h1>
            </div>

            {/* Main Garden Area */}
            <div className="bg-gradient-to-b from-sky-100/50 via-teal-50/50 to-emerald-100/50 rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-[800px] flex flex-col items-center justify-between py-12">
                {/* Carbon Saved Bar - Top section */}
                <motion.div
                  className="w-[400px] mt-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-full shadow-lg h-10 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-lg font-bold text-teal-600">
                        {carbonSaved} kg CO₂
                      </span>
                      <span className="text-sm font-medium text-gray-600 ml-2">
                        Carbon Saved
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Tree and Hill - Middle section */}
                <div className="flex flex-col items-center my-12">
                  {/* Tree Trunk */}
                  <motion.div
                    className="w-4 h-16 bg-amber-800"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    style={{ transformOrigin: 'bottom' }}
                  />
                  
                  {/* Hill/Ground */}
                  <motion.div
                    className="w-32 h-16 bg-emerald-500 rounded-t-full -mt-8 z-10" 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Unrecorded Transactions - Bottom section */}
                <div className="w-full max-w-2xl px-4 mb-8">
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Unrecorded Transactions
                    </h3>
                    <div className="space-y-3">
                      {transactions.map((transaction, index) => (
                        <motion.button
                          key={transaction._id}
                          onClick={() => handleTransactionClick(transaction)}
                          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-500/20 hover:bg-emerald-50/50 transition-all"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-full">
                              <Camera className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-gray-900">{transaction.merchant}</p>
                              <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900">${transaction.amount.toFixed(2)}</p>
                        </motion.button>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseCamera}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Upload Receipt</h2>
              <p className="text-gray-600 mb-4">
                Please take a photo of your receipt for {selectedTransaction?.merchant}
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  onClick={handleCloseCamera}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleCloseCamera}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upload
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


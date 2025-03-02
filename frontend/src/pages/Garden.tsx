"use client"

import { useState, useEffect, useMemo } from "react"
import { Camera } from "../components/Icons"
import useGrowTree from "../hooks/useGrowTree"
import { useCompany } from "../context/CompanyContext"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import DevSidebar from "../components/DevSidebar"
import TopBar from "../components/TopBar"
import Card from "../components/Card"
import CameraCapture from "../components/CameraCapture"

interface Transaction {
  _id: string
  merchant: string
  amount: number
  date: string
  category: string
  receiptUploaded: boolean
}

export default function Garden() {
  const { company } = useCompany()
  const { carbonSaved } = useGrowTree(1000)
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/user/${user.id}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          // Filter for transactions without receipts
          const unprocessedTransactions = data.filter(
            (t: Transaction) => !t.receiptUploaded
          ).sort((a: Transaction, b: Transaction) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setTransactions(unprocessedTransactions)
        } catch (error) {
          console.error("Error fetching transactions:", error)
          setTransactions([])
        }
      }
    }

    fetchTransactions()
  }, [user])

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowCamera(true)
  }

  const handleCloseCamera = async (uploaded: boolean = false) => {
    // Only update transactions if explicitly uploaded
    if (uploaded && selectedTransaction?._id) {
      setTransactions(transactions.filter((t) => t._id !== selectedTransaction._id))
    }
    setShowCamera(false)
    setSelectedTransaction(null)
  }

  // Calculate number of trees based on carbonSaved
  const treeCount = Math.max(1, Math.floor(carbonSaved / 10))
  const treePositions = useMemo(() => {
    const positions = [];
  
    for (let i = 0; i < treeCount; i++) {
      let xPos;
      let maxrange = 1200
  
      if (i === 0) {
        // Ensure the first tree is in the center
        xPos = 0;
      } else {
        // Generate random X positions within a reasonable range
        xPos = (Math.random() - 0.5) * maxrange;
      }

      let miny = -150
      let yPos = Math.random() *(-Math.abs(0.00026 * xPos * xPos)-miny) +miny;  // Slight vertical variation for realism
  
      positions.push({ x: xPos, y: yPos });
    }
  
    return positions;
  }, [treeCount]);

  // Calculate animation duration based on the number of trees
  const animationDuration = Math.min(0.5, 1/(treeCount /30+1)); // Adjust the divisor to control speed

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
              <div className="relative h-[800px] flex flex-col items-center py-12">
                {/* Carbon Saved Bar - Top section */}
                <motion.div
                  className="w-[400px] mt-8 mb-16"
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

                {/* Render trees dynamically on top of the hill */}
                <div className="relative w-full h-48">
                  {treePositions.map((pos, index) => (
                    <motion.div
                      key={index}
                      className="absolute flex flex-col items-center"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: animationDuration, delay: index * 0.1 }}
                      style={{
                        left: `calc(50% + ${pos.x}px)`, // Random positioning but centered
                        bottom: `${pos.y}px`, // Slight height variation
                        zIndex: treeCount + index // Ensure new trees are in front
                      }}
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-full -mt-6 shadow-md" />
                      <div className="w-4 h-16 bg-amber-800" />
                    </motion.div>
                  ))}
                </div>

                {/* Hill/Ground */}
                <motion.div
                  className="w-full h-48 bg-emerald-500 rounded-t-full mb-16" 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ borderRadius: '100% 100% 0 0' }}
                />
                
                {/* Unrecorded Transactions - Bottom section */}
                <div className="w-full max-w-2xl px-4">
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
            onClick={() => handleCloseCamera(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Upload Receipt</h2>
              <p className="text-gray-600 mb-4">
                Please take a photo of your receipt for {selectedTransaction?.merchant}
              </p>
              
              <CameraCapture 
                onUploadSuccess={() => handleCloseCamera(true)}
                onCancel={() => handleCloseCamera(false)}
                transactionId={selectedTransaction?._id}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


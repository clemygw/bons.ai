"use client"

import React from 'react'
import { useState, useEffect, useMemo } from "react"
import { Camera } from "../components/Icons"
import useGrowTree from "../hooks/useGrowTree"
import { useCompany } from "../context/CompanyContext"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import Card from "../components/Card"
import CameraCapture from "../components/CameraCapture"

interface Transaction {
  _id: string
  merchant: string
  amount: number
  date: string
  category: string
  receiptUploaded: boolean
  co2Emissions: number
}

// Average CO2 emissions (in kg) per dollar spent
const CO2_PER_DOLLAR = 3.7  // Average US CO2 emissions per dollar spent

export default function Garden() {
  const { company } = useCompany()
  const { user } = useAuth()
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [unprocessedTransactions, setUnprocessedTransactions] = useState<Transaction[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Calculate carbon saved based on spending vs actual emissions - EXACTLY like company controller
  const carbonSaved = useMemo(() => {
    // Filter transactions for the last month
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const monthlyTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= lastMonth && transactionDate <= now
    })

    console.log('Monthly transactions count:', monthlyTransactions.length)
    console.log('Monthly transactions details:', monthlyTransactions.map(t => ({
      id: t._id,
      date: new Date(t.date).toLocaleDateString(),
      amount: t.amount,
      co2Emissions: t.co2Emissions,
      merchant: t.merchant
    })))

    // Calculate total spending and actual emissions
    const totalSpending = monthlyTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const actualEmissions = monthlyTransactions.reduce((sum, t) => {
      console.log(`Transaction ${t._id} CO2: ${t.co2Emissions || 0}kg`)
      return sum + (t.co2Emissions || 0)
    }, 0)
    
    // Calculate expected emissions based on total spending - MATCH COMPANY CONTROLLER
    const expectedEmissions = totalSpending * CO2_PER_DOLLAR
    
    console.log('Carbon calculation details:', {
      totalSpending,
      actualEmissions,
      expectedEmissions,
      monthlyTransactionsCount: monthlyTransactions.length,
      CO2_PER_DOLLAR
    })
    
    // Calculate emissions reduced (expected - actual) - MATCH COMPANY CONTROLLER
    const emissionsReduced = expectedEmissions - actualEmissions

    // Only return positive savings
    return Math.max(0, emissionsReduced)
  }, [allTransactions])

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/user/${user.id}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          
          // Log all transactions' CO2 emissions
          console.log('All transactions CO2 emissions:', data.map(t => ({
            id: t._id,
            date: new Date(t.date).toLocaleDateString(),
            amount: t.amount,
            co2Emissions: t.co2Emissions,
            merchant: t.merchant
          })))
          
          // Store all transactions for carbon calculations
          setAllTransactions(data)
          
          // Filter for unprocessed transactions for the UI
          const unprocessed = data.filter(
            (t: Transaction) => !t.receiptUploaded
          ).sort((a: Transaction, b: Transaction) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setUnprocessedTransactions(unprocessed)
        } catch (error) {
          console.error("Error fetching transactions:", error)
          setAllTransactions([])
          setUnprocessedTransactions([])
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
    if (uploaded && selectedTransaction?._id) {
      // Update both transaction lists
      setUnprocessedTransactions(prev => prev.filter(t => t._id !== selectedTransaction._id))
      setAllTransactions(prev => prev.map(t => 
        t._id === selectedTransaction._id 
          ? { ...t, receiptUploaded: true }
          : t
      ))
    }
    setShowCamera(false)
    setSelectedTransaction(null)
  }
  
  {/* Calculate number of trees based on carbonSaved */}
  const treeCount = Math.max(1, Math.floor(carbonSaved / 25))
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
        xPos = (Math.random() - 0.5) * 1200; // Range: -150 to 150
      }
      xPos = (Math.random() - 0.5) * maxrange;
      let miny = -140
      let yPos = Math.random() *(-Math.abs(0.00023 * xPos * xPos)-miny) +(miny+60);  // Slight vertical variation for realism
  
      positions.push({ x: xPos, y: yPos });
    }
  
    return positions;
  }, [treeCount]);

  const animationDuration = Math.min(0.5, 1/(treeCount /30+1)); // Adjust the divisor to control speed

  
  return (
    <div className="flex w-full h-full">
      <DevSidebar />
      <div className="flex-1 w-full h-full">
        <TopBar companyName={company?.name} />
        <div className="h-[calc(100vh-4rem)] w-full relative">
          <div className="w-full h-full">
            {/* Header */}
            <div className="flex justify-between items-center py-8 mt-24">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent pl-52">
                Carbon Garden
              </h1>
            </div>

            {/* Main Garden Area */}
            <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-accent/50 via-accent/30 to-accent/50 h-[70vh]">
              <div className="relative h-full flex flex-col items-center">
                {/* Carbon Saved Bar - Top section */}
                <motion.div
                  className="w-[250px] -mt-14 mb-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: animationDuration, delay: 0.2 }}
                >
                  <div className="bg-yellow-400 rounded-full shadow-lg h-[250px] w-[250px] flex items-center justify-center border border-yellow-200/20 backdrop-blur-sm">
                    <div className="text-center">
                      <div>
                        <span className="text-2xl font-bold text-white">
                          {carbonSaved.toFixed(2)} kg CO<sub>2</sub> Reduced
                          <br />
                        </span>
                        <span className="text-xl font-bold text-white">
                          {treeCount} Trees Saved!
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-white/80">
                        (this month)
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    (this month)
                  </div>
                </div>
              </div>
            </motion.div>


            {/* Render trees dynamically on top of the hill */}
            <div className="relative w-full h-48">
              {treePositions.map((pos, index) => (
                <motion.div
                  key={index}
                  className="absolute flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    left: `calc(50% + ${pos.x}px)`, // Random positioning but centered
                    bottom: `${pos.y}px`, // Slight height variation
                    // zIndex: treeCount - index,
                  }}
                >
                  {/* Trunk */}
                  <div className="w-4 h-16 bg-amber-800 shadow-xl" style={{ zIndex: treeCount-index} }/>

                  {/* Foliage Layers */}
                  <div className="w-12 h-12 bg-green-800 rounded-full -mt-14 shadow-xl" style={{ zIndex: (2*treeCount)-index}}/>
                  <div className="w-10 h-10 bg-green-700 rounded-full -mt-14 shadow-xl"style={{ zIndex: (3*treeCount)-index}} />
                  <div className="w-8 h-8 bg-green-600 rounded-full -mt-14 shadow-xl" style={{ zIndex: (4*treeCount)-index}}/>
                  <div className="w-6 h-6 bg-green-500 rounded-full -mt-12 shadow-xl" style={{ zIndex:(5*treeCount)-index}}/>
                </motion.div>
              ))}
            </div>
            {/* Hill/Ground */}
            <motion.div
              className="w-full h-48 bg-primary rounded-t-full mb-16" 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ borderRadius: '100% 100% 0 0' }}
            />
            {/* Unrecorded Transactions - Bottom section */}
            <div className="w-full max-w-2xl px-4 text-center">
              <Card className="bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Unrecorded Transactions
                </h3>
                <div className="space-y-3">
                  {unprocessedTransactions.map((transaction, index) => (
                    <motion.button
                      key={transaction._id}
                      onClick={() => handleTransactionClick(transaction)}
                      className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-accent/50 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent rounded-full">
                          <Camera className="w-5 h-5 text-primary" />
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
                {/* Hill/Ground */}
                <motion.div
                  className="w-full h-48 bg-primary rounded-t-full mb-16" 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ borderRadius: '100% 100% 0 0' }}
                />

                {/* Transaction Indicator */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 text-gray-600 cursor-pointer"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  >
                    <span className="text-sm">
                      {unprocessedTransactions.length > 0 
                        ? `${unprocessedTransactions.length} Unrecorded Transactions`
                        : "All Transactions Processed!"}
                    </span>
                    <svg className="w-8 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="absolute top-[100vh] left-0 right-0 bg-primary min-h-screen">
              <div className="p-8">
                <div className="w-full max-w-2xl mx-auto">
                  <Card className="bg-white/90 backdrop-blur-sm border border-primary/10 shadow-lg">
                    <div className="p-6">
                      <motion.div 
                        className="flex items-center justify-center w-full gap-3 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {unprocessedTransactions.length > 0 ? (
                          <>
                            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                              Unrecorded Transactions
                            </h3>
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          </>
                        ) : (
                          <h3 className="text-xl font-semibold text-gray-600 flex items-center gap-2">
                            All Caught Up! 
                            <span role="img" aria-label="celebration">🎉</span>
                          </h3>
                        )}
                      </motion.div>
                      <div className="space-y-3">
                        {unprocessedTransactions.map((transaction, index) => (
                          <motion.button
                            key={transaction._id}
                            onClick={() => handleTransactionClick(transaction)}
                            className="w-full flex items-center justify-between px-8 py-4 bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-accent/50 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-accent rounded-full">
                                <Camera className="w-5 h-5 text-primary" />
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


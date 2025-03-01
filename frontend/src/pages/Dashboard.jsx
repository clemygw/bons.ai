"use client"
import { useState, useEffect, useMemo } from "react"
import { User, Bell, Camera } from "lucide-react"
import DevSidebar from "../components/DevSidebar"
import TopBar from "../components/TopBar"
import { useAuth } from "../context/AuthContext"
import { useCompany } from "../context/CompanyContext"
import axios from 'axios'
import Layout from "../components/Layout"
import Card from "../components/Card"
import Button from "../components/Button"
import Modal from "../components/Modal"

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

  const handleCloseModal = () => {
    setSelectedTransaction(null)
  }

  return (
    <Layout>
      <div className="grid grid-cols-3 gap-8">
        {/* Main Box (2/3) */}
        <div className="col-span-2">
          <Card>
            <h2 className="card-title">Carbon Emissions by Category</h2>
            
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
          </Card>
        </div>

        {/* Transactions List (1/3) */}
        <div className="col-span-1">
          <Card>
            <h2 className="card-title">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  onClick={() => handleTransactionClick(transaction._id)}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-full">
                      <Camera size={20} className="text-teal-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{transaction.merchant}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction Details Modal */}
      <Modal isOpen={!!selectedTransaction} onClose={handleCloseModal}>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
          
          <div>
            <p className="text-sm text-gray-600">Merchant</p>
            <p className="font-medium">{selectedTransaction?.merchant}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="font-medium">${selectedTransaction?.amount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-medium">{selectedTransaction?.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Carbon Emissions</p>
            <p className="font-medium">{selectedTransaction?.co2Emissions} kg CO₂</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-medium">
              {selectedTransaction?.date && new Date(selectedTransaction.date).toLocaleDateString()}
            </p>
          </div>
          
          <Button 
            variant="secondary"
            onClick={handleCloseModal}
            className="w-full mt-6"
          >
            Close
          </Button>
        </div>
      </Modal>
    </Layout>
  )
}

export default Dashboard


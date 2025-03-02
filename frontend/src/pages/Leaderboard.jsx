"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useCompany } from "../context/CompanyContext"
import DevSidebar from "../components/DevSidebar"
import TopBar from "../components/TopBar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import { Medal } from "lucide-react"

const timeRangeLabels = {
  "1m": "1 month",
  "3m": "3 months",
  "6m": "6 months",
  "1y": "1 year",
}

const getColorByEmissions = (emissions) => {
  // if (emissions < 500) {
  //   return "#4caf50" // Green for low emissions
  // } else if (emissions < 1000) {
  //   return "#fbc02d" // Darker yellow for medium emissions
  // } else {
  //   return "#c62828" // Darker red for high emissions
  // }
  return "#4ba679"
}
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const emissions = payload[0].value // Get the emissions value
    const color = getColorByEmissions(emissions) // Get the color based on emissions
    return (
      <div style={{ backgroundColor: "#fff", color: color, padding: "5px", borderRadius: "5px" }}>
        <p>{`Total Emissions: ${emissions} kg`}</p>
      </div>
    )
  }
  return null
}

const Leaderboard = () => {
  const { company } = useCompany()
  const [leaderboardData, setLeaderboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState("6m")
  const [emissionsTrendData, setEmissionsTrendData] = useState([])
  const [totalEmissionsReduced, setTotalEmissionsReduced] = useState(0)
  const [averageReductionPerUser, setAverageReductionPerUser] = useState(0)
  const [topPerformer, setTopPerformer] = useState("")
  const [loadingChart, setLoadingChart] = useState(true)

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!company?._id) return

      try {
        console.log("Fetching leaderboard data...")
        setLoading(true)
        setLoadingChart(true) // Ensure chart loading state is set to true when fetching new data
        setEmissionsTrendData([]) // Reset emissions trend data before fetching new data
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/companies/${company._id}/leaderboard?timeRange=${timeRange}`,
        )
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data")
        }
        const data = await response.json()
        setLeaderboardData(data)
        if (data.leaderboard) {
          const trendData = calculateEmissionsTrend(data.leaderboard)
          setEmissionsTrendData(trendData)
        }
        console.log(data)
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError(err.message)
      } finally {
        setLoading(false)
        setLoadingChart(false)
      }
    }

    fetchLeaderboardData()
  }, [company, timeRange])

  useEffect(() => {
    if (leaderboardData) {
      // Count up for total emissions reduced
      const totalEmissions = Math.round(leaderboardData.companyStats.totalEmissionsReduced)
      let count = 0
      const duration = 2000 // Duration in milliseconds
      const incrementTime = 20 // Time between increments in milliseconds
      const incrementAmount = Math.ceil(totalEmissions / (duration / incrementTime))

      const interval = setInterval(() => {
        count += incrementAmount
        if (count >= totalEmissions) {
          count = totalEmissions
          clearInterval(interval)
        }
        setTotalEmissionsReduced(count)
      }, incrementTime)

      // Count up for average reduction per user
      const averageReduction = Math.round(leaderboardData.companyStats.averageReductionPerUser)
      count = 0
      const averageIncrementAmount = Math.ceil(averageReduction / (duration / incrementTime))

      const averageInterval = setInterval(() => {
        count += averageIncrementAmount
        if (count >= averageReduction) {
          count = averageReduction
          clearInterval(averageInterval)
        }
        setAverageReductionPerUser(count)
      }, incrementTime)

      // Set top performer
      setTopPerformer(leaderboardData.companyStats.topPerformer)

      return () => {
        clearInterval(interval)
        clearInterval(averageInterval)
      }
    }
  }, [leaderboardData])

  const calculateEmissionsTrend = (leaderboard) => {
    // Create an array of total emissions for each user
    const trendData = leaderboard.map((user) => ({
      name: `${user.firstName} ${user.lastName}`, // User's name
      totalEmissions: user.totalEmissions, // Use total emissions directly
    }))

    return trendData
  }

  useEffect(() => {
    // Force chart re-render when data changes
    if (emissionsTrendData.length > 0) {
      // First set loading to ensure clean slate
      setLoadingChart(true)

      // Use RAF to ensure browser has time to process
      const animationFrame = requestAnimationFrame(() => {
        // Then use timeout to delay showing chart until DOM is ready
        const timer = setTimeout(() => {
          setLoadingChart(false)
        }, 100)

        return () => clearTimeout(timer)
      })

      return () => cancelAnimationFrame(animationFrame)
    }
  }, [emissionsTrendData])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex">
        <DevSidebar />
        <div className="flex-1">
          <TopBar companyName={company?.name} />
          <div className="text-center text-red-600 p-4">Error loading leaderboard: {error}</div>
        </div>
      </div>
    )
  }

  if (!leaderboardData) {
    return (
      <div className="flex">
        <DevSidebar />
        <div className="flex-1">
          <TopBar companyName={company?.name} />
          <div className="text-center text-gray-600 p-4">No leaderboard data available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <DevSidebar />
      <div className="flex-1">
        <TopBar companyName={company?.name} />
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 mt-16">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent ml-2">
                {leaderboardData?.companyName} Leaderboard
              </h1>

              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            {/* Company Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">
                  Total Emissions Reduced ({timeRangeLabels[timeRange]})
                </h3>
                <p className="text-3xl font-bold text-primary">{totalEmissionsReduced.toLocaleString()} kg</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">Average Per User ({timeRangeLabels[timeRange]})</h3>
                <p className="text-3xl font-bold text-primary">{averageReductionPerUser.toLocaleString()} kg</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">Top Performer</h3>
                <p className="text-3xl font-bold text-primary">{topPerformer}</p>
              </div>
            </div>

            {/* Emissions Trend Graph */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Emissions per User</h2>
              {loadingChart ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400} key={`chart-${timeRange}-${emissionsTrendData.length}`}>
                  <BarChart data={emissionsTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="totalEmissions"
                      fill="#8884d8"
                      animationDuration={1500}
                      animationBegin={300}
                      animationEasing="ease-out"
                      isAnimationActive={true}
                    >
                      {emissionsTrendData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={getColorByEmissions(entry.totalEmissions)} />
                      ))}
                      <LabelList dataKey="totalEmissions" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Employee Rankings</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emissions Reduced
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reduction %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboardData.leaderboard.map((entry) => (
                      <tr key={entry.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 flex items-center justify-between">
                            <span>#{entry.rank}</span>
                            {entry.rank === 1 ? (
                              <Medal className="h-5 w-5 ml-2 text-yellow-500" fill="gold" />
                            ) : entry.rank === 2 ? (
                              <Medal className="h-5 w-5 ml-2 text-gray-400" fill="silver" />
                            ) : entry.rank === 3 ? (
                              <Medal className="h-5 w-5 ml-2 text-amber-700" fill="#cd7f32" />
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.firstName} {entry.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {Math.round(entry.emissionsReduced).toLocaleString()} kg
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-medium ${
                              Number.parseFloat(entry.percentageReduced) >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {entry.percentageReduced}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard


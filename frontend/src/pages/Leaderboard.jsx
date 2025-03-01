"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import DevSidebar from "../components/DevSidebar"

// Mock data for development
const mockEmissionsData = [
  { date: "2024-01", emissions: 850 },
  { date: "2024-02", emissions: 740 },
  { date: "2024-03", emissions: 680 },
  { date: "2024-04", emissions: 720 },
  { date: "2024-05", emissions: 630 },
  { date: "2024-06", emissions: 590 },
]

const mockLeaderboard = [
  { rank: 1, name: "John Doe", company: "Acme Corp", emissions: 450, change: -15 },
  { rank: 2, name: "Jane Smith", company: "TechCo", emissions: 520, change: -8 },
  { rank: 3, name: "Bob Johnson", company: "EcoTech", emissions: 580, change: -12 },
  { rank: 4, name: "Alice Brown", company: "GreenCo", emissions: 610, change: -5 },
  { rank: 5, name: "Charlie Wilson", company: "Acme Corp", emissions: 650, change: -10 },
]

const Leaderboard = () => {
  const [timeRange, setTimeRange] = useState("6m")

  return (
    <div className="min-h-screen bg-gray-50">
      <DevSidebar />

      <div className="ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-600">Leaderboard</h1>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Company Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Emissions Reduced</h3>
              <p className="text-3xl font-bold text-teal-600">2,450 kg</p>
              <p className="text-sm text-gray-600 mt-1">CO₂ equivalent</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Average per Employee</h3>
              <p className="text-3xl font-bold text-teal-600">490 kg</p>
              <p className="text-sm text-gray-600 mt-1">CO₂ equivalent</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Company Ranking</h3>
              <p className="text-3xl font-bold text-teal-600">#3</p>
              <p className="text-sm text-gray-600 mt-1">of 50 companies</p>
            </div>
          </div>

          {/* Emissions Graph */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Carbon Emissions Over Time</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockEmissionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={{ fill: "#0d9488" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Employee Rankings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mockLeaderboard.map((user) => (
                <div key={user.rank} className="px-6 py-4 flex items-center">
                  <div className="w-12 text-center">
                    <span
                      className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-full
                      ${
                        user.rank === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : user.rank === 2
                            ? "bg-gray-100 text-gray-700"
                            : user.rank === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-50 text-gray-600"
                      }
                    `}
                    >
                      {user.rank}
                    </span> 
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{user.emissions} kg CO₂</p>
                    <p className={`text-sm ${user.change < 0 ? "text-green-600" : "text-red-600"}`}>
                      {user.change < 0 ? "↓" : "↑"} {Math.abs(user.change)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Leaderboard


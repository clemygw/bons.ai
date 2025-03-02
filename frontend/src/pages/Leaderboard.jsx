"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useCompany } from "../context/CompanyContext"
import { LineChart,BarChart,Bar,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const timeRangeLabels = {
  "1m": "1 month",
  "3m": "3 months",
  "6m": "6 months",
  "1y": "1 year",
};

const Leaderboard = () => {
  const { company } = useCompany();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("6m");
  const [emissionsTrendData, setEmissionsTrendData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!company?._id) return;
      
      try {
        console.log("Fetching leaderboard data...");
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/companies/${company._id}/leaderboard?timeRange=${timeRange}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        setLeaderboardData(data);
        if (data.leaderboard) {
          const trendData = calculateEmissionsTrend(data.leaderboard);
          setEmissionsTrendData(trendData);
        }
        console.log(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [company, timeRange]);
  const calculateEmissionsTrend = (leaderboard) => {
    // Create an array of total emissions for each user
    const trendData = leaderboard.map((user) => ({
      name: `${user.firstName} ${user.lastName}`, // User's name
      totalEmissions: user.totalEmissions, // Use total emissions directly
    }));

    return trendData;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center text-red-600 p-4">
          Error loading leaderboard: {error}
        </div>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center text-gray-600 p-4">
          No leaderboard data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
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
            <p className="text-3xl font-bold text-primary">
              {Math.round(leaderboardData.companyStats.totalEmissionsReduced).toLocaleString()} kg
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Average Per User ({timeRangeLabels[timeRange]})
            </h3>
            <p className="text-3xl font-bold text-primary">
              {Math.round(leaderboardData.companyStats.averageReductionPerUser).toLocaleString()} kg
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600">Top Performer</h3>
            <p className="text-3xl font-bold text-primary">
              {leaderboardData.companyStats.topPerformer}
            </p>
          </div>
        </div>
        {/* Emissions Trend Graph */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Emissions Trend</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={emissionsTrendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalEmissions" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
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
                      <div className="text-sm font-medium text-gray-900">#{entry.rank}</div>
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
                      <div className={`text-sm font-medium ${
                        parseFloat(entry.percentageReduced) >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
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
  );
};

export default Leaderboard;


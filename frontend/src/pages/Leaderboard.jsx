"use client"

import { useState, useEffect } from "react"
import { useCompany } from "../context/CompanyContext"
import DevSidebar from "../components/DevSidebar"
import TopBar from "../components/TopBar"

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

  if (loading) {
    return (
      <div className="flex">
        <DevSidebar />
        <div className="flex-1">
          <TopBar companyName={company?.name} />
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <DevSidebar />
        <div className="flex-1">
          <TopBar companyName={company?.name} />
          <div className="text-center text-red-600 p-4">
            Error loading leaderboard: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="flex">
        <DevSidebar />
        <div className="flex-1">
          <TopBar companyName={company?.name} />
          <div className="text-center text-gray-600 p-4">
            No leaderboard data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <DevSidebar />
      <div className="flex-1">
        <TopBar companyName={company?.name} />
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent ml-2">
                {leaderboardData?.companyName} Leaderboard
              </h1>
              
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

            {/* Company Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">
                  Total Emissions Reduced ({timeRangeLabels[timeRange]})
                </h3>
                <p className="text-3xl font-bold text-teal-600">
                  {Math.round(leaderboardData.companyStats.totalEmissionsReduced).toLocaleString()} kg
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">
                  Average Per User ({timeRangeLabels[timeRange]})
                </h3>
                <p className="text-3xl font-bold text-teal-600">
                  {Math.round(leaderboardData.companyStats.averageReductionPerUser).toLocaleString()} kg
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">Top Performer</h3>
                <p className="text-3xl font-bold text-teal-600">
                  {leaderboardData.companyStats.topPerformer}
                </p>
              </div>
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
      </div>
    </div>
  );
};

export default Leaderboard;


import { useAuth } from "../context/AuthContext"

const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">bons.ai Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to bons.ai</h2>
          <p className="text-gray-600">
            This is a placeholder dashboard. You can customize this page with your actual dashboard content.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Sample dashboard cards */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium">Dashboard Card {item}</h3>
                <p className="text-sm text-gray-500 mt-2">This is a placeholder card for your dashboard content.</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard


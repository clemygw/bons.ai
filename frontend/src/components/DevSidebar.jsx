import { Link } from "react-router-dom"
import { LayoutDashboard, Trophy, TreePine, Settings, LogOut } from "lucide-react"

const DevSidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-teal-600">Development Menu</h2>
          <p className="text-xs text-gray-500">Whats up gang</p>
        </div>

        <nav className="space-y-2 flex-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/leaderboard"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors"
          >
            <Trophy size={20} />
            <span>Leaderboard</span>
          </Link>

          <Link
            to="/my-tree"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors"
          >
            <TreePine size={20} />
            <span>My Tree</span>
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors"
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <button
          onClick={() => {
            /* Add logout logic */
            //router.push("/dashboard")
            
            

          }}
          className="flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default DevSidebar


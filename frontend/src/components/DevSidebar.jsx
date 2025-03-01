"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LayoutDashboard, Trophy, Sprout, Settings, LogOut } from "lucide-react"
import { useUser } from "../context/UserContext"

const DevSidebar = () => {
  const { logout } = useUser()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    let timeout
    if (isHovering) {
      setIsCollapsed(false)
    } else {
      timeout = setTimeout(() => setIsCollapsed(true), 300)
    }
    return () => clearTimeout(timeout)
  }, [isHovering])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      } z-20`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex flex-col h-full">
        <div className={`mb-8 p-4 ${isCollapsed ? "items-center" : ""}`}>
          <h2
            className={`text-lg font-semibold text-teal-600 whitespace-nowrap overflow-hidden ${
              isCollapsed ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            style={{ height: '24px' }}
          >
            Development Menu
          </h2>
          <p
            className={`text-xs text-gray-500 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            style={{ height: '16px' }}
          >
            Whats up gang
          </p>
        </div>

        <nav className="space-y-2 flex-1 p-4">
          <Link
            to="/garden"
            className="flex items-center w-full gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors cursor-pointer"
          >
            <Sprout size={20} className={`min-w-[20px] ${isCollapsed ? "opacity-0" : "opacity-100"} transition-opacity duration-300`} />
            <span
              className={`whitespace-nowrap ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              } transition-all duration-300`}
            >
              Garden
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center w-full gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors cursor-pointer"
          >
            <LayoutDashboard size={20} className={`min-w-[20px] ${isCollapsed ? "opacity-0" : "opacity-100"} transition-opacity duration-300`} />
            <span
              className={`whitespace-nowrap ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              } transition-all duration-300`}
            >
              Dashboard
            </span>
          </Link>

          <Link
            to="/leaderboard"
            className="flex items-center w-full gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors cursor-pointer"
          >
            <Trophy size={20} className={`min-w-[20px] ${isCollapsed ? "opacity-0" : "opacity-100"} transition-opacity duration-300`} />
            <span
              className={`whitespace-nowrap ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              } transition-all duration-300`}
            >
              Leaderboard
            </span>
          </Link>

          <Link
            to="/settings"
            className="flex items-center w-full gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors cursor-pointer"
          >
            <Settings size={20} className={`min-w-[20px] ${isCollapsed ? "opacity-0" : "opacity-100"} transition-opacity duration-300`} />
            <span
              className={`whitespace-nowrap ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              } transition-all duration-300`}
            >
              Settings
            </span>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-7 py-4 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut size={20} className={`min-w-[20px] ${isCollapsed ? "opacity-0" : "opacity-100"} transition-opacity duration-300`} />
          <span
            className={`whitespace-nowrap ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            } transition-all duration-300`}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  )
}

export default DevSidebar


"use client"

import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { Home, BarChart2, Camera, LogOut, Users } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"


const DevSidebar = () => {
  const { logout } = useUser()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved ? JSON.parse(saved) : true
  })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    let timeout
    if (isHovering) {
      setIsCollapsed(false)
      localStorage.setItem('sidebarCollapsed', 'false')
    } else {
      timeout = setTimeout(() => {
        setIsCollapsed(true)
        localStorage.setItem('sidebarCollapsed', 'true')
      }, 300)
    }
  }

  const menuItems = [
    { icon: Home, label: "Garden", path: "/garden" },
    { icon: BarChart2, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Leaderboard", path: "/leaderboard" },
    { icon: Camera, label: "Upload Receipt", path: "/receipt-upload" },
  ]

  return (
    <>
      {/* Spacer div to prevent content overlap */}
      <div className="w-16 flex-shrink-0" />
      
      <motion.div 
        className="fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 flex flex-col items-start py-6 shadow-sm"
        initial={{ width: "4rem" }}
        animate={{ width: isHovered ? "12rem" : "4rem" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{ duration: 0.3 }}
      >
        <div className="w-14 h-10 pl-3 flex items-center">
          <div className="flex flex-col gap-1.5 items-center justify-center w-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-6 h-0.5 bg-gray-600 rounded-full"
              />
            ))}
          </div>
        </div>

        <nav className="flex-1 flex flex-col items-start gap-2 w-full mt-8">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <motion.div 
                key={item.path} 
                className="w-full px-2"
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={`
                    w-full h-10 flex items-center gap-3 px-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <motion.div
                    whileHover="hover"
                    variants={pulseVariant}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <motion.span
                    className="font-medium whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0,
                      width: isHovered ? "auto" : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <motion.button
          onClick={logout}
          className="w-full px-2 h-10 flex items-center gap-3 hover:bg-gray-50 transition-all rounded-lg mx-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 px-3">
            <motion.div
              whileHover="hover"
              variants={pulseVariant}
            >
              <LogOut size={20} className="text-gray-600" />
            </motion.div>
            <motion.span
              className="font-medium whitespace-nowrap text-gray-600"
              initial={{ opacity: 0, width: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                width: isHovered ? "auto" : 0
              }}
              transition={{ duration: 0.2 }}
            >
              Sign Out
            </motion.span>
          </div>
        </motion.button>
      </motion.div>
    </>
  )
}


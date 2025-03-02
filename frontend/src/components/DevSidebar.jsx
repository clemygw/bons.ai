"use client"

import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { Home, BarChart2, Camera, LogOut, Users } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

export default function DevSidebar() {
  const location = useLocation()
  const { logout } = useAuth()
  const [isHovered, setIsHovered] = useState(false)

  const pulseVariant = {
    hover: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const menuItems = [
    { icon: Home, label: "Garden", path: "/garden" },
    { icon: BarChart2, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Leaderboard", path: "/leaderboard" },
    { icon: Camera, label: "AR Tree", path: "/ar" }
    
  ]

  return (
    <>
      {/* Spacer div to prevent content overlap */}

      
      <motion.div 
        className="fixed left-0 top-0 bottom-0 bg-transparent flex flex-col items-start py-6 z-50"
        initial={{ width: "4rem" }}
        animate={{ width: isHovered ? "12rem" : "4rem" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{ duration: 0.3 }}
      >
        <nav className="flex-1 flex flex-col items-start gap-2 w-full mt-14">
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
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm"
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


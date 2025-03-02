"use client"

import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { Home, BarChart2, Camera, LogOut, Users, Menu } from "lucide-react"
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

  // Animation variants for the hamburger menu
  const topBarVariants = {
    closed: { width: "24px" },
    open: { width: "16px" }
  }

  const middleBarVariants = {
    closed: { width: "24px" },
    open: { width: "20px" }
  }

  const bottomBarVariants = {
    closed: { width: "24px" },
    open: { width: "12px" }
  }

  // Staggered animation for menu items
  const sidebarAnimation = {
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const menuItemAnimation = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
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
      <div className="w-16 flex-shrink-0" />
      
      <motion.div 
        className="fixed left-0 top-0 bottom-0 bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 flex flex-col items-start py-6 shadow-md z-50 overflow-hidden"
        initial={{ width: "4rem" }}
        animate={{ width: isHovered ? "12rem" : "4rem" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)"
        }}
      >
        <div className="w-12 h-6 pl-5 flex items-center">
          <div className="flex flex-col gap-1.5 items-start justify-center">
            {/* Animated hamburger menu */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-full origin-left"
              variants={topBarVariants}
              animate={isHovered ? "open" : "closed"}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.div
              className="h-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-full origin-left"
              variants={middleBarVariants}
              animate={isHovered ? "open" : "closed"}
              transition={{ duration: 0.3, ease: "easeInOut", delay: 0.05 }}
            />
            <motion.div
              className="h-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-full origin-left"
              variants={bottomBarVariants}
              animate={isHovered ? "open" : "closed"}
              transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
            />
          </div>
        </div>

        <motion.nav 
          className="flex-1 flex flex-col items-start gap-2 w-full mt-12 overflow-hidden"
          variants={sidebarAnimation}
          animate={isHovered ? "open" : "closed"}
          initial="closed"
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <motion.div 
                key={item.path} 
                className="w-full px-2"
                variants={menuItemAnimation}
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={`
                    w-full h-10 flex items-center gap-3 px-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                        : "text-gray-600 hover:bg-white hover:shadow-sm"
                    }
                  `}
                >
                  <motion.div
                    whileHover="hover"
                    variants={pulseVariant}
                    className={isActive ? "text-primary-foreground" : "text-primary"}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <motion.span
                    className="font-medium whitespace-nowrap overflow-hidden"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0,
                      width: isHovered ? "auto" : 0
                    }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </motion.div>
            )
          })}
        </motion.nav>

        <motion.button
          onClick={logout}
          className="w-full px-2 h-10 flex items-center gap-3 hover:bg-white hover:shadow-sm transition-all rounded-lg mx-0 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 px-3">
            <motion.div
              whileHover="hover"
              variants={pulseVariant}
            >
              <LogOut size={20} className="text-rose-500" />
            </motion.div>
            <motion.span
              className="font-medium whitespace-nowrap text-rose-500 overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                width: isHovered ? "auto" : 0
              }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              Sign Out
            </motion.span>
          </div>
        </motion.button>
      </motion.div>
    </>
  )
}


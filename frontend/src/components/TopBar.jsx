"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bell, User, Settings, LogOut, Leaf } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function TopBar({ children, companyName }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSignOut = () => {
    logout()
    setShowProfileMenu(false)
    navigate("/login")
  }

  const handleAccountSettings = () => {
    // Add navigation to account settings
    console.log("Opening account settings...")
    // Example: router.push('/account/settings')
    setShowProfileMenu(false)
  }

  return (
    <motion.div 
      className="fixed top-0 right-0 left-0 h-16 bg-white border-b z-50 flex items-center justify-between px-8"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <Link to="/garden" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-red-500 rounded-lg flex items-center justify-center shadow-sm">
            <Leaf size={18} className="text-primary-foreground" />
          </div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight">
            bons.ai
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {children}
        <motion.button
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={20} className="text-gray-600" />
        </motion.button>
        <div className="relative" ref={profileMenuRef}>
          <motion.button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={20} className="text-gray-600" />
          </motion.button>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={handleAccountSettings}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings size={16} />
                  Account Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}


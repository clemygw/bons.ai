"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bell, User, Settings, LogOut, Leaf } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function TopBar({ children, companyName }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)

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
    // Add sign out logic here
    console.log("Signing out...")
    // Example: auth.signOut()
    setShowProfileMenu(false)
  }

  const handleAccountSettings = () => {
    // Add navigation to account settings
    console.log("Opening account settings...")
    // Example: router.push('/account/settings')
    setShowProfileMenu(false)
  }

  return (
    <motion.div 
      className="fixed top-0 right-0 left-16 h-16 bg-white border-b z-50 flex items-center justify-between px-8"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
          <Leaf size={18} className="text-white" />
        </div>
        <h1 className="font-bold text-xl bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
          Bons.ai
        </h1>
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
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <User size={20} />
          </motion.button>
          
          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={handleAccountSettings}
                >
                  <Settings size={16} />
                  <span>Account Settings</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}


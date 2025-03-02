"use client"

import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import DevSidebar from "./DevSidebar"
import TopBar from "./TopBar"
import { useState, useEffect } from "react"

export default function Layout() {
  const location = useLocation()
  const [mounted, setMounted] = useState(false)
  
  // Ensure animations run after initial mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Fixed background elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50/50 via-sky-50/50 to-emerald-50/50 -z-20" />
      
      {/* Animated background orbs */}
      <motion.div 
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-200/10 blur-3xl -z-10"
        animate={{ 
          x: [100, 120, 100],
          y: [-100, -120, -100],
          transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 15,
            ease: "easeInOut"
          }
        }}
      />
      
      <motion.div 
        className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-green-200/10 blur-3xl -z-10"
        animate={{ 
          x: [-100, -120, -100],
          y: [100, 120, 100],
          transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 18,
            ease: "easeInOut",
            delay: 2
          }
        }}
      />
      
      {/* Fixed noise overlay */}
      <div className="noise fixed inset-0 pointer-events-none -z-5" />
      
      {/* Fixed navigation elements - these should never animate with page changes */}
      <DevSidebar />
      <TopBar />
      
      {/* Main content area */}
      <div className="ml-16 pt-16">
        {/* Super simple crossfade animation */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            <div className="page-container">
              <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}


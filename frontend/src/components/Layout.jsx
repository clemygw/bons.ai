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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  // Ensure animations run after initial mount
  useEffect(() => {
    setMounted(true)
    
    // Add resize listener for responsive behavior
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Fixed background elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50/50 via-sky-50/50 to-emerald-50/50 -z-20" />
      
      {/* Animated background orbs - responsive positioning */}
      <motion.div 
        className="fixed top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-blue-200/10 blur-3xl -z-10"
        animate={{ 
          x: isMobile ? [50, 60, 50] : [100, 120, 100],
          y: isMobile ? [-50, -60, -50] : [-100, -120, -100],
          transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: isMobile ? 10 : 15,
            ease: "easeInOut"
          }
        }}
      />
      
      <motion.div 
        className="fixed bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-green-200/10 blur-3xl -z-10"
        animate={{ 
          x: isMobile ? [-50, -60, -50] : [-100, -120, -100],
          y: isMobile ? [50, 60, 50] : [100, 120, 100],
          transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: isMobile ? 12 : 18,
            ease: "easeInOut",
            delay: 2
          }
        }}
      />
      
      {/* Fixed noise overlay */}
      <div className="noise fixed inset-0 pointer-events-none -z-5" />
      
      {/* Fixed navigation elements - these should never animate with page changes */}
      <DevSidebar />
      <div className="flex-1">
        <TopBar />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-[calc(100vh-4rem)]"
        >
          <Outlet />
        </motion.main>
      </div>
    </>
  )
}


"use client"

import { Outlet } from 'react-router-dom'
import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import DevSidebar from "./DevSidebar"
import TopBar from "./TopBar"
import { Sun, Moon } from "./Icons"
import { useState } from "react"

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-sky-50/50 to-emerald-50/50">
      <div className="noise" />
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
    </div>
  )
}


"use client"

import { motion } from "framer-motion"

export default function Card({ children, className = "", hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`
        glass border border-white/20 rounded-2xl shadow-xl 
        dark:border-gray-800/50
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}


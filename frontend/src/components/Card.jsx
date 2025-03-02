"use client"

import { motion } from "framer-motion"

export default function Card({ children, className = "", hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`
        bg-card border border-border rounded-2xl shadow-xl 
        dark:border-border/50
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}


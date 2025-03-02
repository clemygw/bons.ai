"use client"

import { motion } from "framer-motion"
import { forwardRef } from "react"

const Button = forwardRef(
  ({ children, variant = "primary", size = "md", isLoading = false, className = "", ...props }, ref) => {
    const baseStyles =
      "relative rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 focus:ring-teal-500",
      secondary:
        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500 border border-gray-200 dark:border-gray-700",
      outline: "border-2 border-teal-500 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950 focus:ring-teal-500",
    }

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    }

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <span className={isLoading ? "opacity-0" : "opacity-100"}>{children}</span>
      </motion.button>
    )
  },
)

Button.displayName = "Button"

export default Button


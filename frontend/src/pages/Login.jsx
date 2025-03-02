"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoginForm from "../components/LoginForm"
// import BonsaiLogo from "../assets/bonsai-logo"
// import bonsaiLogo from "../assets/bonsai_logo_no_red.png" // Import the new logo
// import { Leaf } from "lucide-react" // No longer needed
 
import authService from "../services/authService"
import { motion } from "framer-motion"

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [companyName, setCompanyName] = useState("")

  const handleLogin = async (credentials) => {
    setIsLoading(true)
    try {
      setIsLoading(true)
      setError("")

      // Call the auth service
      const response = await authService.signin(credentials)

      // Update global auth context
      setUser(response.user)

      // Navigate to dashboard
      setTimeout(() => {
        navigate("/garden")
      }, 100)
      return response
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#E9EDC9", padding: "4px" }}>
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          style={{ padding: "40px 20px" }}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-teal-500 to-red-500 rounded-full p-4 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src="/leaf.svg" 
                alt="Bons.ai Logo" 
                className="w-[88px] h-[88px] text-white"
              />
            </motion.div>
          </motion.div>
          <motion.h1 
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome to bons.ai
          </motion.h1>
          <motion.p 
            className="text-center text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Sign in to your account to continue
          </motion.p>

          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company-name">
              Company Name
            </label>
            <input
              type="text"
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your company name"
            />
          </div> */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </motion.div>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <motion.a 
                href="/signup" 
                className="text-teal-600 hover:text-emerald-600 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign up
              </motion.a>
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 rounded-lg mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-center text-white text-xs">© {new Date().getFullYear()} bons.ai. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login


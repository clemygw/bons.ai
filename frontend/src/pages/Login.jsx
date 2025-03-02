"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoginForm from "../components/LoginForm"
// import BonsaiLogo from "../assets/bonsai-logo"
import bonsaiLogo from "../assets/bonsai_logo_no_red.png" // Import the new logo
 
import authService from "../services/authService"

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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#E9EDC9", padding: "4px" }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ padding: "40px 20px" }}>
          <div className="flex justify-center mb-8">
            <div className="w-64 h-64 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-full p-4 flex items-center justify-center">
              <img src={bonsaiLogo} alt="Bonsai.ai Logo" className="w-full h-full rounded-full" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome to bons.ai
          </h1>
          <p className="text-center text-gray-600 mb-8">Sign in to your account to continue</p>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

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

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-teal-600 hover:text-emerald-600 font-medium transition-colors">
                Sign up
              </a>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4">
          <p className="text-center text-white text-xs">© {new Date().getFullYear()} bons.ai. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login


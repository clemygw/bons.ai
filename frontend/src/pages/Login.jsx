"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCompany } from '../context/CompanyContext'
import LoginForm from "../components/LoginForm"
import BonsaiLogo from "../assets/bonsai-logo"
import authService from "../services/authService"

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const { updateCompany } = useCompany()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [companyName, setCompanyName] = useState("")

  const handleLogin = async (credentials) => {
    setIsLoading(true)
    try {
      setIsLoading(true)
      setError("")

      // Login user
      const loginResponse = await authService.signin(credentials)
      console.log('Fetching user by login response:', loginResponse.user);
      
      setUser(loginResponse.user)

      // If user has a company, fetch and store company data
      if (loginResponse.user.company) {
        console.log('Fetching company data from user...');
        
        const companyResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/companies/${loginResponse.user.company._id}`
        )
        const companyData = await companyResponse.json()
        
        console.log('Company Data Received:', companyData);
        
        updateCompany(companyData)
      } else {
        console.log('No company associated with user');
      }

      // Navigate to dashboard
      setTimeout(() => {
        navigate("/garden")
      }, 100)
      return loginResponse
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.")
      console.error('Login error:', {
        error: err,
        message: err.message,
        stack: err.stack
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ padding: "40px 20px" }}>
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-teal-50 rounded-lg p-4 flex items-center justify-center">
              <BonsaiLogo />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome to bons.ai</h1>
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
              <a href="/signup" className="text-teal-600 hover:text-teal-800 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>

        <div className="bg-teal-600 p-4">
          <p className="text-center text-white text-xs">© {new Date().getFullYear()} bons.ai. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login


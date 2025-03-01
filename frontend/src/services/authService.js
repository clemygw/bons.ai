// This file would contain your actual authentication API calls

const API_URL = "http://localhost:5001/api" // Replace with your actual API URL

const authService = {
  signin: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to login")
      }

      // Store token and user data
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      
      return data
    } catch (error) {
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },
}

export default authService


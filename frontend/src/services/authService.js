// This file would contain your actual authentication API calls

const API_URL = "http://localhost:5000/api" // Replace with your actual API URL

export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const data = await response.json()

    // Store the token in localStorage or a more secure storage
    localStorage.setItem("token", data.token)

    return data
  },

  logout: () => {
    localStorage.removeItem("token")
  },

  getCurrentUser: () => {
    const token = localStorage.getItem("token")
    // You might want to decode the JWT token here to get user info
    return token ? { token } : null
  },
}

export default authService


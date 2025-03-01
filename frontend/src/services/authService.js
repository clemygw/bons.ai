const authService = {
  signin: async (credentials) => {
    try {
      // Single API call that returns user with populated transactions
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      // Store token and complete user data (which now includes transactions)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      //console.log('User data with transactions:', data.user);
      
      return data;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;


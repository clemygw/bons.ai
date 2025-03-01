import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Leaderboard from "./pages/Leaderboard"
import CameraCapture from './components/CameraCapture';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />   /*see where goes*/
      <Route
        path="/dashboard"
        element={
            <Dashboard />

        }
      />
      <Route
        path="/leaderboard"
        element={
          
            <Leaderboard />
          
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/upload-receipt" element={<CameraCapture />} />
    </Routes>
  )
}

export default App


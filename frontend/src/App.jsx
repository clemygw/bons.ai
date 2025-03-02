import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Leaderboard from "./pages/Leaderboard"
import CameraCapture from './components/CameraCapture'
import Garden from "./pages/Garden"
import Layout from "./components/Layout"
import { AuthProvider } from './context/AuthContext'
import { CompanyProvider } from './context/CompanyContext'
import { UserProvider } from "./context/UserContext"
import './styles/index.css'
import './styles/tailwind.css'
import ARTree from './components/ARTree';

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
    <AuthProvider>
      <UserProvider>
        <CompanyProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/upload-receipt" element={<CameraCapture />} />
            <Route element={<Layout />}>
              <Route
                path="/garden"
                element={
                  <ProtectedRoute>
                    <Garden />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/ar" element={<ARTree/>}/>
          </Routes>
        </CompanyProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App


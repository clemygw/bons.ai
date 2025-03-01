import { User, Bell } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

const TopBar = ({ companyName = 'Loading...' }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const { logout } = useUser()
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    console.log("Logging out...")
    logout()
    navigate('/login')
    setShowDropdown(false)
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-teal-600">bons.ai</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{companyName}</span>
          <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors">
            <Bell size={20} />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => {
                console.log("Toggling dropdown!")
                setShowDropdown(!showDropdown)
              }}
              className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <User size={20} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 
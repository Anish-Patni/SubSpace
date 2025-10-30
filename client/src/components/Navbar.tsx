import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="border-t-2 border-b-2 border-black p-5 sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Navigation Links */}
        <div className="flex gap-8">
          <Link to="/" className="text-lg font-black text-black hover:opacity-70 transition-opacity">
            Home
          </Link>
          {/* <Link to="/dashboard" className="text-lg font-black text-black hover:opacity-70 transition-opacity">
            Explore
          </Link> */}
          {/* <Link to="/settings" className="text-lg font-black text-black hover:opacity-70 transition-opacity">
            Settings
          </Link> */}
        </div>

        {/* Right Authentication */}
        {!isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-lg font-black text-black hover:opacity-70 transition-opacity">
              Log-In
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 bg-custom-yellow border-3 border-black font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all rounded text-sm">
                Sign-Up
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {/* <Link to="/" className="text-lg font-black text-black hover:opacity-70 transition-opacity">
              Home
            </Link> */}
            <Link to="/dashboard" className="text-lg font-black text-black hover:opacity-70 transition-opacity">
              Dashboard
            </Link>
            <Link to="/analytics" className="text-lg font-black text-black hover:opacity-70 transition-opacity">
              Analytics
            </Link>
            <Link to="/calendar" className="text-lg font-black text-black hover:opacity-70 transition-opacity">
              Calendar
            </Link>
            <Link to="/add">
              <button className="px-4 py-2 bg-custom-yellow border-3 border-black font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all rounded text-sm">
                Add
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="text-lg font-black text-black hover:opacity-70 transition-opacity"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

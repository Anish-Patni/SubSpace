import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus, LayoutDashboard, Home, Settings, LogOut, BarChart3, Calendar } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="border-b-2 p-6 sticky top-0 z-50" style={{ backgroundColor: 'var(--nb-card)', borderColor: 'var(--nb-border)' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tight hover:opacity-70 transition-opacity">
          SubSync
        </Link>

        {!isAuthenticated ? (
          <div className="flex gap-3">
            <Link to="/login">
              <button className="px-6 py-2.5 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button
                className="px-6 py-2.5 font-semibold rounded-lg text-white shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: 'var(--nb-accent)' }}
              >
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/">
              <button className="px-4 py-2.5 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Home size={20} />
                <span className="hidden md:inline">Home</span>
              </button>
            </Link>

            <Link to="/dashboard">
              <button
                className={`px-4 py-2.5 font-semibold rounded-lg transition-colors flex items-center gap-2 ${location.pathname === '/dashboard' || location.pathname.startsWith('/subscription/')
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <LayoutDashboard size={20} />
                <span className="hidden md:inline">Dashboard</span>
              </button>
            </Link>

            <Link to="/analytics">
              <button
                className={`px-4 py-2.5 font-semibold rounded-lg transition-colors flex items-center gap-2 ${location.pathname === '/analytics'
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <BarChart3 size={20} />
                <span className="hidden md:inline">Analytics</span>
              </button>
            </Link>

            <Link to="/calendar">
              <button
                className={`px-4 py-2.5 font-semibold rounded-lg transition-colors flex items-center gap-2 ${location.pathname === '/calendar'
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <Calendar size={20} />
                <span className="hidden md:inline">Calendar</span>
              </button>
            </Link>

            <Link to="/add">
              <button
                className="px-5 py-2.5 font-semibold rounded-lg text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                style={{ backgroundColor: 'var(--nb-accent)' }}
              >
                <Plus size={20} />
                <span className="hidden md:inline">Add</span>
              </button>
            </Link>

            <Link to="/settings">
              <button className="px-4 py-2.5 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                <Settings size={20} />
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 font-semibold rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

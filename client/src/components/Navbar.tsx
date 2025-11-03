import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Menu, X } from 'lucide-react'

export const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="border-t-2 border-b-2 border-black p-4 md:p-5 sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Navigation Links - Desktop */}
        <div className="hidden md:flex gap-8">
          <Link to="/" className="text-lg font-black text-black hover:opacity-70 transition-opacity">
            Home
          </Link>
        </div>

        {/* Mobile Logo/Brand */}
        <div className="md:hidden">
          <Link to="/" className="text-xl font-black text-black">
            SUBSPACE
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Right Authentication - Desktop */}
        {!isAuthenticated ? (
          <div className="hidden md:flex items-center gap-6">
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
          <div className="hidden md:flex items-center gap-6">
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b-2 border-black shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="text-lg font-black text-black hover:opacity-70 transition-opacity py-2"
            >
              Home
            </Link>
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="text-lg font-black text-black hover:opacity-70 transition-opacity py-2"
                >
                  Log-In
                </Link>
                <Link to="/register" onClick={closeMobileMenu}>
                  <button className="w-full px-4 py-3 bg-custom-yellow border-3 border-black font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded text-sm">
                    Sign-Up
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="text-lg font-black text-black hover:opacity-70 transition-opacity py-2"
                >
                  Dashboard
                </Link>
                <Link
                  to="/analytics"
                  onClick={closeMobileMenu}
                  className="text-lg font-black text-black hover:opacity-70 transition-opacity py-2"
                >
                  Analytics
                </Link>
                <Link
                  to="/calendar"
                  onClick={closeMobileMenu}
                  className="text-lg font-black text-black hover:opacity-70 transition-opacity py-2"
                >
                  Calendar
                </Link>
                <Link to="/add" onClick={closeMobileMenu}>
                  <button className="w-full px-4 py-3 bg-custom-yellow border-3 border-black font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded text-sm">
                    Add Subscription
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-lg font-black text-black hover:opacity-70 transition-opacity py-2 text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

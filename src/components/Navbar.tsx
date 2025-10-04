import { Link, useLocation } from 'react-router-dom'
import { Plus, LayoutDashboard, Home, Settings } from 'lucide-react'
import { AuthButton } from './AuthButton'

export const Navbar = () => {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <nav className="border-b-2 p-6 sticky top-0 z-50" style={{ backgroundColor: 'var(--nb-card)', borderColor: 'var(--nb-border)' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tight hover:opacity-70 transition-opacity">
          Subsync
        </Link>

        {isLanding ? (
          <AuthButton />
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
                className={`px-4 py-2.5 font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  location.pathname === '/dashboard' || location.pathname.startsWith('/subscription/')
                    ? 'bg-gray-100' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard size={20} />
                <span className="hidden md:inline">Dashboard</span>
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

            <div className="ml-2 pl-2 border-l-2" style={{ borderColor: 'var(--nb-border)' }}>
              <AuthButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

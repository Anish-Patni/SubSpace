import { useUser } from '@civic/auth/react'
import { SignInButton, SignOutButton, UserButton } from '@civic/auth/react'
import { LogOut, User } from 'lucide-react'

export const AuthButton = () => {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <button 
        disabled
        className="px-6 py-2.5 font-semibold rounded-lg bg-gray-100 cursor-wait"
      >
        Loading...
      </button>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100">
          <User size={18} />
          <span className="font-semibold text-sm">
            {user.email || user.sub?.slice(0, 8) + '...'}
          </span>
        </div>
        <SignOutButton>
          <button className="px-4 py-2.5 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </SignOutButton>
      </div>
    )
  }

  return (
    <SignInButton>
      <button
        className="px-8 py-2.5 font-semibold rounded-lg text-white shadow-lg hover:shadow-xl transition-all"
        style={{ backgroundColor: 'var(--nb-accent)' }}
      >
        Get Started
      </button>
    </SignInButton>
  )
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { LogIn, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: 'var(--nb-bg)', color: 'var(--nb-ink)' }}>
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="text-3xl sm:text-4xl font-black tracking-tight hover:opacity-70 transition-opacity">
            Subsync
          </Link>
        </div>

        {/* Login Card */}
        <div 
          className="border-3 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: 'var(--nb-card)' }}
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <LogIn size={28} className="sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl font-black">Welcome Back</h1>
          </div>
          <p className="text-base sm:text-lg mb-6 sm:mb-8">Sign in to manage your subscriptions</p>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 sm:border-3 border-black font-bold text-base sm:text-lg focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                style={{ backgroundColor: 'white' }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 sm:border-3 border-black font-bold text-base sm:text-lg focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                style={{ backgroundColor: 'white' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full px-5 sm:px-6 py-3 sm:py-4 border-3 sm:border-4 border-black font-black text-base sm:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--nb-accent)' }}
            >
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div 
          className="mt-4 sm:mt-6 border-3 sm:border-4 border-black p-4 sm:p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: 'var(--nb-accent-2)' }}
        >
          <p className="text-base sm:text-lg font-bold">
            Don't have an account?{' '}
            <Link to="/register" className="underline hover:no-underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

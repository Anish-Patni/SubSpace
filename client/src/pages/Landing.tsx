import { Link } from 'react-router-dom'
import { CreditCard, Sparkles, TrendingUp, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

export const Landing = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)', color: 'var(--nb-ink)' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-6xl font-black mb-6 leading-tight">
          Manage All Your<br />
          Subscriptions Effortlessly
        </h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto">
          Track, organize, and optimize your recurring payments with AI-powered insights
        </p>
        
        {/* Mock Dashboard Preview */}
        <div 
          className="max-w-4xl mx-auto border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-12"
          style={{ backgroundColor: 'var(--nb-card)' }}
        >
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-3 border-black p-4 h-32" style={{ backgroundColor: i === 1 ? 'var(--nb-accent-2)' : i === 2 ? 'var(--nb-accent)' : 'var(--nb-ok)' }}></div>
            ))}
          </div>
          <div className="text-left space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-3 border-black p-4 bg-white"></div>
            ))}
          </div>
        </div>

        <Link to="/dashboard">
          <button 
            className="px-12 py-4 text-xl border-4 border-black font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all"
            style={{ backgroundColor: 'var(--nb-accent)' }}
          >
            Go to Dashboard
          </button>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div 
            className="border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: 'var(--nb-card)' }}
          >
            <CreditCard className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-black mb-3">Centralized Tracking</h3>
            <p className="text-lg">All your subscriptions in one place. Never lose track of what you're paying for.</p>
          </div>
          
          <div 
            className="border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: 'var(--nb-card)' }}
          >
            <Sparkles className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-black mb-3">AI Input</h3>
            <p className="text-lg">Just describe your subscription naturally. Our AI extracts all the details.</p>
          </div>
          
          <div 
            className="border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: 'var(--nb-card)' }}
          >
            <TrendingUp className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-black mb-3">Smart Insights</h3>
            <p className="text-lg">Get spending analytics and renewal reminders to stay in control.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

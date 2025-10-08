import { Link } from 'react-router-dom'
import { CreditCard, Sparkles, TrendingUp } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const Landing = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fef9ec' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="relative">
              <div className="inline-block bg-red-500 border-4 border-black px-6 py-3 transform -rotate-2 mb-4">
                <span className="text-white font-black text-lg">Hi, I am</span>
              </div>
              <h1 className="text-8xl font-black text-black mb-6 leading-none tracking-tighter">
                SUBSPACE
              </h1>

            </div>

            <p className="text-xl font-bold text-gray-800 leading-relaxed max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>

            <div className="flex gap-6">
              <Link to="/dashboard">
                <button className="px-8 py-4 text-xl border-4 border-black font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-yellow-400">
                  Join Dashboard Now!
                </button>
              </Link>

              <Link to="/add">
                <button className="px-8 py-4 text-xl border-4 border-black font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-red-500 text-white">
                  Add Subscription
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Subscription Cards */}
          <div className="relative h-[400px] flex items-center justify-center">
            

            {/* Back Card - Adobe */}
            <div className="absolute border-6 border-black bg-white p-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-[340px] h-[280px] transform rotate-6 translate-x-16 translate-y-4 z-20">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black text-gray-700 mb-1">Adobe</h3>
                  <p className="text-xl font-black text-gray-500">$54.99</p>
                </div>
                {/* Yellow Circle with Orange Diamond */}
                <div className="w-24 h-24 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-orange-400 border-2 border-black transform rotate-45"></div>
                </div>
              </div>
            </div>

            {/* Front Card - Netflix */}
            <div className="absolute border-6 border-black bg-white p-6 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] w-[340px] h-[280px] transform -rotate-3 -translate-x-4 z-30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-3xl font-black text-gray-700 mb-1">Netflix</h3>
                  <p className="text-xl font-black text-gray-500 line-through">$15.00</p>
                </div>
                {/* Colorful Grid Icon */}
                <div className="w-16 h-16 bg-white border-4 border-black p-1.5">
                  <div className="grid grid-cols-3 gap-0.5 h-full">
                    <div className="bg-red-400"></div>
                    <div className="bg-orange-400"></div>
                    <div className="bg-yellow-400"></div>
                    <div className="bg-green-400"></div>
                    <div className="bg-blue-400"></div>
                    <div className="bg-purple-400"></div>
                    <div className="bg-pink-400"></div>
                    <div className="bg-cyan-400"></div>
                    <div className="bg-indigo-400"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-600 mb-4 leading-tight">
                sum dolor sit amet consectetur adipiscing elit.
              </p>
              <button className="px-5 py-2 bg-green-300 border-3 border-black font-black text-gray-800 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Button
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-7xl font-black text-black mb-6">FEATURES</h2>
          <div className="w-32 h-4 bg-custom-orange border-4 border-black mx-auto transform rotate-2"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="border-8 border-black bg-white p-10 shadow-[11px_11px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="bg-custom-green border-6 border-black p-6 mb-6">
              <CreditCard className="w-16 h-16 text-black" />
            </div>
            <h3 className="text-3xl font-black mb-4 text-black">CENTRALIZED TRACKING</h3>
            <p className="text-xl font-bold text-gray-800 leading-relaxed">All your subscriptions in one place. Never lose track of what you're paying for.</p>
            <div className="mt-6 w-full h-3 bg-custom-orange border-2 border-black"></div>
          </div>
          
          <div className="border-8 border-black bg-white p-10 shadow-[11px_11px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="bg-custom-lavender border-6 border-black p-6 mb-6">
              <Sparkles className="w-16 h-16 text-black" />
            </div>
            <h3 className="text-3xl font-black mb-4 text-black">AI INPUT</h3>
            <p className="text-xl font-bold text-gray-800 leading-relaxed">Just describe your subscription naturally. Our AI extracts all the details.</p>
            <div className="mt-6 w-full h-3 bg-custom-yellow border-2 border-black"></div>
          </div>
          
          <div className="border-8 border-black bg-white p-10 shadow-[11px_11px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="bg-custom-orange border-6 border-black p-6 mb-6">
              <TrendingUp className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-3xl font-black mb-4 text-black">SMART INSIGHTS</h3>
            <p className="text-xl font-bold text-gray-800 leading-relaxed">Get spending analytics and renewal reminders to stay in control.</p>
            <div className="mt-6 w-full h-3 bg-custom-green border-2 border-black"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

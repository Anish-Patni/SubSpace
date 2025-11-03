import { Link } from 'react-router-dom'
import { CreditCard, Sparkles, TrendingUp } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const Landing = () => {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#fef9ec' }}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}></div>
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="relative">
              <div className="inline-block bg-red-500 border-4 border-black px-4 sm:px-6 py-2 sm:py-3 transform -rotate-2 mb-4">
                <span className="text-white font-black text-base sm:text-lg">Hi, I am</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-black mb-4 sm:mb-6 leading-none tracking-tighter">
                SUBSPACE
              </h1>

            </div>

            <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-relaxed max-w-lg">
              Take control of your recurring payments. Track subscriptions, get renewal alerts, and discover exactly where your money goes each month with AI-powered insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link to="/dashboard">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl border-4 border-black font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-yellow-400">
                  Join Dashboard Now!
                </button>
              </Link>

              <Link to="/add">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl border-4 border-black font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-red-500 text-white">
                  Add Subscription
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Subscription Cards */}
          <div className="relative h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-center">
            

            {/* Back Card - Adobe */}
            <div className="absolute border-4 sm:border-6 border-black bg-white p-4 sm:p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-[280px] sm:w-[320px] md:w-[340px] h-[230px] sm:h-[260px] md:h-[280px] transform rotate-6 translate-x-8 sm:translate-x-12 md:translate-x-16 translate-y-4 z-20">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-700 mb-1">Adobe</h3>
                  <p className="text-lg sm:text-xl font-black text-gray-500">$54.99</p>
                </div>
                {/* Yellow Circle with Orange Diamond */}
                <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
                  <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-orange-400 border-2 border-black transform rotate-45"></div>
                </div>
              </div>
            </div>

            {/* Front Card - Netflix */}
            <div className="absolute border-4 sm:border-6 border-black bg-white p-4 sm:p-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] sm:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] w-[280px] sm:w-[320px] md:w-[340px] h-[230px] sm:h-[260px] md:h-[280px] transform -rotate-3 -translate-x-2 sm:-translate-x-4 z-30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-700 mb-1">Netflix</h3>
                  <p className="text-lg sm:text-xl font-black text-gray-500 line-through">$15.00</p>
                </div>
                {/* Colorful Grid Icon */}
                <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-white border-4 border-black p-1.5">
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
              <p className="text-xs sm:text-sm font-bold text-gray-600 mb-3 sm:mb-4 leading-tight">
                sum dolor sit amet consectetur adipiscing elit.
              </p>
              <button className="px-4 sm:px-5 py-2 bg-green-300 border-2 sm:border-3 border-black font-black text-gray-800 text-xs sm:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Button
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black mb-4 sm:mb-6">FEATURES</h2>
          <div className="w-24 sm:w-32 h-3 sm:h-4 bg-custom-orange border-4 border-black mx-auto transform rotate-2"></div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
          <div className="border-6 sm:border-8 border-black bg-white p-6 sm:p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[11px_11px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="bg-custom-green border-4 sm:border-6 border-black p-4 sm:p-6 mb-4 sm:mb-6">
              <CreditCard className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 text-black" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 text-black">CENTRALIZED TRACKING</h3>
            <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-relaxed">All your subscriptions in one place. Never lose track of what you're paying for.</p>
            <div className="mt-4 sm:mt-6 w-full h-2 sm:h-3 bg-custom-orange border-2 border-black"></div>
          </div>
          
          <div className="border-6 sm:border-8 border-black bg-white p-6 sm:p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[11px_11px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="bg-custom-lavender border-4 sm:border-6 border-black p-4 sm:p-6 mb-4 sm:mb-6">
              <Sparkles className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 text-black" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 text-black">AI INPUT</h3>
            <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-relaxed">Just describe your subscription naturally. Our AI extracts all the details.</p>
            <div className="mt-4 sm:mt-6 w-full h-2 sm:h-3 bg-custom-yellow border-2 border-black"></div>
          </div>
          
          <div className="border-6 sm:border-8 border-black bg-white p-6 sm:p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[11px_11px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all sm:col-span-2 md:col-span-1">
            <div className="bg-custom-orange border-4 sm:border-6 border-black p-4 sm:p-6 mb-4 sm:mb-6">
              <TrendingUp className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 text-black">SMART INSIGHTS</h3>
            <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-relaxed">Get spending analytics and renewal reminders to stay in control.</p>
            <div className="mt-4 sm:mt-6 w-full h-2 sm:h-3 bg-custom-green border-2 border-black"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { subscriptionService } from '@/services/subscriptionService'
import { Subscription } from '@/types/subscription'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, Calendar, Package } from 'lucide-react'

export const Analytics = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionService.getAll()
      setSubscriptions(data)
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate analytics data
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  
  const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
    let monthlyPrice = sub.price
    if (sub.billingCycle === 'yearly') monthlyPrice = sub.price / 12
    if (sub.billingCycle === 'weekly') monthlyPrice = sub.price * 4
    if (sub.billingCycle === 'quarterly') monthlyPrice = sub.price / 3
    return sum + monthlyPrice
  }, 0)

  const totalYearly = totalMonthly * 12

  // Category breakdown
  const categoryData = activeSubscriptions.reduce((acc, sub) => {
    const category = sub.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = 0
    }
    let monthlyPrice = sub.price
    if (sub.billingCycle === 'yearly') monthlyPrice = sub.price / 12
    if (sub.billingCycle === 'weekly') monthlyPrice = sub.price * 4
    if (sub.billingCycle === 'quarterly') monthlyPrice = sub.price / 3
    acc[category] += monthlyPrice
    return acc
  }, {} as Record<string, number>)

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }))

  // Billing cycle breakdown
  const billingCycleData = activeSubscriptions.reduce((acc, sub) => {
    const cycle = sub.billingCycle
    if (!acc[cycle]) {
      acc[cycle] = { count: 0, total: 0 }
    }
    acc[cycle].count += 1
    acc[cycle].total += sub.price
    return acc
  }, {} as Record<string, { count: number; total: number }>)

  const billingCycleChartData = Object.entries(billingCycleData).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count: data.count,
    total: parseFloat(data.total.toFixed(2))
  }))

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)' }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl font-bold">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)', color: 'var(--nb-ink)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-8">Analytics Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="border-3 sm:border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold">Monthly Spend</h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black">${totalMonthly.toFixed(2)}</p>
          </div>

          <div className="border-3 sm:border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold">Yearly Spend</h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black">${totalYearly.toFixed(2)}</p>
          </div>

          <div className="border-3 sm:border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Package className="w-6 h-6 sm:w-8 sm:h-8" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold">Active Subs</h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black">{activeSubscriptions.length}</p>
          </div>

          <div className="border-3 sm:border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold">Avg per Sub</h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black">
              ${activeSubscriptions.length > 0 ? (totalMonthly / activeSubscriptions.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Category Breakdown */}
          <div className="border-3 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
            <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">Spending by Category</h2>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    className="sm:outerRadius-[100px]"
                  >
                    {categoryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-gray-500">No data available</p>
            )}
          </div>

          {/* Billing Cycle Breakdown */}
          <div className="border-3 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
            <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">Billing Cycles</h2>
            {billingCycleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <BarChart data={billingCycleChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                  <XAxis dataKey="name" stroke="#000" className="text-xs sm:text-sm" />
                  <YAxis stroke="#000" className="text-xs sm:text-sm" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#4ECDC4" stroke="#000" strokeWidth={2} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-gray-500">No data available</p>
            )}
          </div>
        </div> 

        {/* Top Subscriptions */}
        <div className="mt-6 sm:mt-8 border-3 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
          <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">Most Expensive Subscriptions</h2>
          <div className="space-y-3 sm:space-y-4">
            {activeSubscriptions
              .sort((a, b) => b.price - a.price)
              .slice(0, 5)
              .map((sub, index) => (
                <div key={sub._id} className="flex items-center justify-between border-2 border-black p-3 sm:p-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xl sm:text-2xl font-black">{index + 1}</span>
                    <div>
                      <p className="font-bold text-base sm:text-lg">{sub.serviceName}</p>
                      <p className="text-xs sm:text-sm capitalize">{sub.billingCycle}</p>
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black">${sub.price.toFixed(2)}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

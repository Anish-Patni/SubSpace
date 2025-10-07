import { useState } from 'react'
import { Search } from 'lucide-react'
import { Subscription, SubscriptionStatus } from '@/types/subscription'
import { SubscriptionCard } from '@/components/SubscriptionCard'
import { StatsCard } from '@/components/StatsCard'
import { SpendingChart, CategoryChart } from '@/components/SpendingChart'
import { Navbar } from '@/components/Navbar'

// Mock data
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    serviceName: 'Netflix',
    price: 15.99,
    billingCycle: 'monthly',
    renewalDate: '2025-10-15',
    paymentMethod: 'Visa ****1234',
    status: 'active',
    createdAt: '2024-01-01',
    totalSpent: 191.88
  },
  {
    id: '2',
    serviceName: 'Spotify',
    price: 9.99,
    billingCycle: 'monthly',
    renewalDate: '2025-10-20',
    paymentMethod: 'Mastercard ****5678',
    status: 'active',
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    serviceName: 'Adobe Creative Cloud',
    price: 54.99,
    billingCycle: 'monthly',
    renewalDate: '2025-10-10',
    paymentMethod: 'Visa ****1234',
    status: 'paused',
    createdAt: '2024-03-01'
  }
]

export const Dashboard = () => {
  const [filter, setFilter] = useState<SubscriptionStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubs = mockSubscriptions.filter(sub => {
    const matchesFilter = filter === 'all' || sub.status === filter
    const matchesSearch = sub.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalMonthly = mockSubscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.price, 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)', color: 'var(--nb-ink)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            label="Total Monthly Spend" 
            value={`$${totalMonthly.toFixed(2)}`}
            color="var(--nb-accent)"
          />
          <StatsCard 
            label="Next Renewal" 
            value="Oct 10"
            color="var(--nb-accent-2)"
          />
          <StatsCard 
            label="Active Subscriptions" 
            value={mockSubscriptions.filter(s => s.status === 'active').length.toString()}
            color="var(--nb-ok)"
          />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-4 border-black font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              style={{ backgroundColor: 'var(--nb-card)' }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          {(['all', 'active', 'paused', 'canceled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 border-3 border-black font-bold transition-all ${
                filter === status 
                  ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                  : 'hover:translate-x-1 hover:translate-y-1'
              }`}
              style={{ 
                backgroundColor: filter === status ? 'var(--nb-accent-2)' : 'var(--nb-card)'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Subscription Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubs.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
        </div>

        {filteredSubs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl font-bold">No subscriptions found</p>
          </div>
        )}
      </div>
    </div>
  )
}

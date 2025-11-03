import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Subscription, SubscriptionStatus } from '@/types/subscription'
import { SubscriptionCard } from '@/components/SubscriptionCard'
import { StatsCard } from '@/components/StatsCard'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { subscriptionService } from '@/services/subscriptionService'
import { toast } from 'sonner'

export const Dashboard = () => {
  const [filter, setFilter] = useState<SubscriptionStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [stats, setStats] = useState({ totalMonthly: '0', activeCount: 0, nextRenewal: null as string | null })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [subsData, statsData] = await Promise.all([
        subscriptionService.getAll(),
        subscriptionService.getStats()
      ])
      setSubscriptions(subsData)
      setStats(statsData)
    } catch (error: any) {
      toast.error('Failed to load subscriptions')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSubs = subscriptions.filter(sub => {
    const matchesFilter = filter === 'all' || sub.status === filter
    const matchesSearch = sub.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatNextRenewal = (date: string | null) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)' }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#fef9ec', color: 'var(--nb-ink)' }}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}></div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard 
            label="Total Monthly Spend" 
            value={`$${stats.totalMonthly}`}
            color="var(--nb-accent)"
          />
          <StatsCard 
            label="Next Renewal" 
            value={formatNextRenewal(stats.nextRenewal)}
            color="var(--nb-accent-2)"
          />
          <StatsCard 
            label="Active Subscriptions" 
            value={stats.activeCount.toString()}
            color="var(--nb-ok)"
          />
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" size={20} />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-3 sm:border-4 border-black font-bold text-base sm:text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              style={{ backgroundColor: 'var(--nb-card)' }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          {(['all', 'active', 'paused', 'canceled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 sm:px-6 py-2 border-2 sm:border-3 border-black font-bold text-sm sm:text-base transition-all ${
                filter === status 
                  ? 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
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
        {subscriptions.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <p className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">No subscriptions yet</p>
            <p className="text-base sm:text-lg mb-4 sm:mb-6">Start by adding your first subscription</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredSubs.map((sub) => (
                <SubscriptionCard key={sub._id} subscription={sub} onUpdate={loadData} />
              ))}
            </div>

            {filteredSubs.length === 0 && subscriptions.length > 0 && (
              <div className="text-center py-12 sm:py-16 md:py-20">
                <p className="text-xl sm:text-2xl font-bold">No subscriptions match your filters</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

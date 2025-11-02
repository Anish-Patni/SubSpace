import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { subscriptionService } from '@/services/subscriptionService'
import { Subscription } from '@/types/subscription'
import { ChevronLeft, ChevronRight, DollarSign, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const CalendarView = () => {
  const navigate = useNavigate()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionService.getAll()
      setSubscriptions(data.filter(s => s.status === 'active'))
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const getSubscriptionsForDay = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    return subscriptions.filter(sub => {
      const renewalDate = new Date(sub.renewalDate)
      return renewalDate.getDate() === day &&
        renewalDate.getMonth() === month &&
        renewalDate.getFullYear() === year
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const today = new Date()
  const isToday = (day: number) => {
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Calculate total for the month
  const monthTotal = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .reduce((sum, day) => {
      const daySubs = getSubscriptionsForDay(day)
      return sum + daySubs.reduce((daySum, sub) => daySum + sub.price, 0)
    }, 0)

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const downloadCalendar = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/subscriptions/export/calendar', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to download calendar')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'subscriptions.ics'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('Calendar file downloaded!')
    } catch (error) {
      console.error('Failed to download calendar:', error)
      toast.error('Failed to download calendar')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)' }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl font-bold">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)', color: 'var(--nb-ink)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-black">Renewal Calendar</h1>
          
          <div className="flex gap-4 items-center">
            {/* Export Calendar Button */}
            <button
              onClick={downloadCalendar}
              className="px-6 py-3 border-4 border-black font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
              style={{ backgroundColor: 'var(--custom-lavender)' }}
            >
              <Download className="w-5 h-5" />
              Export Calendar
            </button>
            
            {/* Month Total */}
            <div className="border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                <div>
                  <p className="text-sm font-bold">This Month</p>
                  <p className="text-2xl font-black">${monthTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Calendar */}
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
            <div className="flex items-center justify-between p-6 border-b-4 border-black">
              <button
                onClick={previousMonth}
                className="p-3 border-3 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: 'var(--nb-bg)' }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-black">{monthName}</h2>
              <button
                onClick={nextMonth}
                className="p-3 border-3 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ backgroundColor: 'var(--nb-bg)' }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {days.map(day => (
                  <div key={day} className="text-center font-black text-sm p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Actual days */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const daySubs = getSubscriptionsForDay(day)
                  const dayTotal = daySubs.reduce((sum, sub) => sum + sub.price, 0)
                  const isTodayDate = isToday(day)

                  return (
                    <div
                      key={day}
                      className={`aspect-square border-3 border-black p-1 relative ${isTodayDate ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                        }`}
                      style={{
                        backgroundColor: daySubs.length > 0 ? 'var(--nb-accent)' : 'var(--nb-bg)'
                      }}
                    >
                      <div className="font-black text-sm mb-1">{day}</div>
                      {daySubs.length > 0 && (
                        <div className="space-y-1">
                          {daySubs.slice(0, 1).map(sub => (
                            <div
                              key={sub._id}
                              onClick={() => navigate(`/subscription/${sub._id}`)}
                              className="text-[10px] font-bold p-0.5 border border-black cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all truncate"
                              style={{ backgroundColor: 'var(--nb-card)' }}
                              title={`${sub.serviceName} - $${sub.price}`}
                            >
                              {sub.serviceName.slice(0, 8)}
                            </div>
                          ))}
                          {daySubs.length > 1 && (
                            <div className="text-[10px] font-bold text-center">
                              +{daySubs.length - 1}
                            </div>
                          )}
                          <div className="text-[10px] font-black text-center">
                            ${dayTotal.toFixed(0)}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: Upcoming Renewals List */}
          <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
            <h2 className="text-2xl font-black mb-6">Upcoming Renewals</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {subscriptions
                .filter(sub => {
                  const renewalDate = new Date(sub.renewalDate)
                  return renewalDate.getMonth() === currentDate.getMonth() &&
                    renewalDate.getFullYear() === currentDate.getFullYear()
                })
                .sort((a, b) => new Date(a.renewalDate).getDate() - new Date(b.renewalDate).getDate())
                .map(sub => {
                  const renewalDate = new Date(sub.renewalDate)
                  const isPast = renewalDate < today

                  return (
                    <div
                      key={sub._id}
                      onClick={() => navigate(`/subscription/${sub._id}`)}
                      className="flex items-center justify-between border-3 border-black p-4 cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      style={{
                        backgroundColor: isPast ? 'var(--nb-bg)' : 'var(--nb-card)',
                        opacity: isPast ? 0.6 : 1
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center border-2 border-black p-2 min-w-[60px]" style={{ backgroundColor: 'var(--nb-accent)' }}>
                          <div className="text-2xl font-black">{renewalDate.getDate()}</div>
                          <div className="text-xs font-bold">{renewalDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                        </div>
                        <div>
                          <p className="font-black text-lg">{sub.serviceName}</p>
                          <p className="text-sm capitalize">{sub.billingCycle} • {sub.category || 'Uncategorized'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black">${sub.price.toFixed(2)}</p>
                        {isPast && <p className="text-xs font-bold text-red-600">Past Due</p>}
                      </div>
                    </div>
                  )
                })}
              {subscriptions.filter(sub => {
                const renewalDate = new Date(sub.renewalDate)
                return renewalDate.getMonth() === currentDate.getMonth() &&
                  renewalDate.getFullYear() === currentDate.getFullYear()
              }).length === 0 && (
                  <p className="text-center py-8 text-gray-500">No renewals this month</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

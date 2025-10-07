import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pause, X, Edit, Play, Trash2 } from 'lucide-react'
import { Subscription } from '@/types/subscription'
import { Navbar } from '@/components/Navbar'
import { subscriptionService } from '@/services/subscriptionService'
import { toast } from 'sonner'

export const SubscriptionDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSubscription()
  }, [id])

  const loadSubscription = async () => {
    if (!id) return
    try {
      const data = await subscriptionService.getById(id)
      setSubscription(data)
    } catch (error: any) {
      toast.error('Failed to load subscription')
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: 'active' | 'paused' | 'canceled') => {
    if (!id) return
    try {
      await subscriptionService.update(id, { status: newStatus })
      toast.success(`Subscription ${newStatus}`)
      loadSubscription()
    } catch (error: any) {
      toast.error('Failed to update subscription')
    }
  }

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this subscription?')) return
    try {
      await subscriptionService.delete(id)
      toast.success('Subscription deleted')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error('Failed to delete subscription')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const calculateDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date()
    const renewal = new Date(renewalDate)
    const diff = Math.ceil((renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
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

  if (!subscription) {
    return null
  }

  const statusColors = {
    active: 'var(--nb-ok)',
    paused: 'var(--nb-warn)',
    canceled: 'var(--nb-error)'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)', color: 'var(--nb-ink)' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div
          className="border-4 border-black p-8 mb-8 flex items-center justify-between"
          style={{ backgroundColor: 'var(--nb-card)' }}
        >
          <div className="flex items-center gap-6">
            <div
              className="w-20 h-20 border-3 border-black flex items-center justify-center text-3xl font-black"
              style={{ backgroundColor: 'var(--nb-accent)' }}
            >
              {subscription.serviceName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2">{subscription.serviceName}</h1>
              <div
                className="inline-block px-4 py-1 border-2 border-black font-bold"
                style={{ backgroundColor: statusColors[subscription.status] }}
              >
                {subscription.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div
          className="border-4 border-black p-8 mb-8"
          style={{ backgroundColor: 'var(--nb-card)' }}
        >
          <h2 className="text-2xl font-black mb-6">Subscription Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-3 border-black p-4">
              <p className="font-bold mb-2">Price</p>
              <p className="text-2xl font-black">${subscription.price}</p>
            </div>

            <div className="border-3 border-black p-4">
              <p className="font-bold mb-2">Billing Cycle</p>
              <p className="text-2xl font-black capitalize">{subscription.billingCycle}</p>
            </div>

            <div className="border-3 border-black p-4">
              <p className="font-bold mb-2">Renewal Date</p>
              <p className="text-2xl font-black">{formatDate(subscription.renewalDate)}</p>
            </div>

            <div className="border-3 border-black p-4">
              <p className="font-bold mb-2">Days Until Renewal</p>
              <p className="text-2xl font-black">{calculateDaysUntilRenewal(subscription.renewalDate)} days</p>
            </div>

            {subscription.paymentMethod && (
              <div className="border-3 border-black p-4">
                <p className="font-bold mb-2">Payment Method</p>
                <p className="text-2xl font-black">{subscription.paymentMethod}</p>
              </div>
            )}

            {subscription.category && (
              <div className="border-3 border-black p-4">
                <p className="font-bold mb-2">Category</p>
                <p className="text-2xl font-black">{subscription.category}</p>
              </div>
            )}

            {subscription.notes && (
              <div className="border-3 border-black p-4 md:col-span-2">
                <p className="font-bold mb-2">Notes</p>
                <p className="text-lg">{subscription.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {subscription.status === 'active' && (
            <button
              onClick={() => handleStatusChange('paused')}
              className="py-3 border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--nb-warn)' }}
            >
              <Pause size={20} /> Pause
            </button>
          )}

          {subscription.status === 'paused' && (
            <button
              onClick={() => handleStatusChange('active')}
              className="py-3 border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--nb-ok)' }}
            >
              <Play size={20} /> Resume
            </button>
          )}

          {subscription.status !== 'canceled' && (
            <button
              onClick={() => handleStatusChange('canceled')}
              className="py-3 border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--nb-error)' }}
            >
              <X size={20} /> Cancel
            </button>
          )}

          <button
            onClick={handleDelete}
            className="py-3 border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--nb-error)' }}
          >
            <Trash2 size={20} /> Delete
          </button>
        </div>

        {/* Created Date */}
        <div
          className="border-4 border-black p-6 text-center"
          style={{ backgroundColor: 'var(--nb-card)' }}
        >
          <p className="font-bold mb-2">Added on</p>
          <p className="text-xl font-black">{formatDate(subscription.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}

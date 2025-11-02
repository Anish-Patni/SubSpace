import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pause, X, Play, Trash2, Plus, UserPlus } from 'lucide-react'
import { Subscription } from '@/types/subscription'
import { Navbar } from '@/components/Navbar'
import { subscriptionService } from '@/services/subscriptionService'
import { toast } from 'sonner'

export const SubscriptionDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [emailInput, setEmailInput] = useState('')
  const [isAddingUser, setIsAddingUser] = useState(false)

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

  const addSharedUser = async () => {
    if (!id || !subscription) return
    
    const trimmedEmail = emailInput.trim()
    if (!trimmedEmail) {
      toast.error('Please enter an email address')
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    const currentShared = subscription.sharedWith || []
    if (currentShared.includes(trimmedEmail)) {
      toast.error('This user is already added')
      return
    }
    
    try {
      setIsAddingUser(true)
      const updatedShared = [...currentShared, trimmedEmail]
      await subscriptionService.update(id, { sharedWith: updatedShared })
      toast.success(`Added ${trimmedEmail}`)
      setEmailInput('')
      loadSubscription()
    } catch (error: any) {
      toast.error('Failed to add user')
    } finally {
      setIsAddingUser(false)
    }
  }

  const removeSharedUser = async (email: string) => {
    if (!id || !subscription) return
    
    if (!confirm(`Remove ${email} from this subscription?`)) return
    
    try {
      const currentShared = subscription.sharedWith || []
      const updatedShared = currentShared.filter(e => e !== email)
      await subscriptionService.update(id, { sharedWith: updatedShared })
      toast.success(`Removed ${email}`)
      loadSubscription()
    } catch (error: any) {
      toast.error('Failed to remove user')
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black">{subscription.serviceName}</h1>
                {subscription.isShared && (
                  <div 
                    className="px-4 py-2 border-2 border-black font-bold text-sm flex items-center gap-2"
                    style={{ backgroundColor: 'var(--nb-accent-2)' }}
                  >
                    <UserPlus size={16} />
                    SHARED WITH YOU
                  </div>
                )}
              </div>
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

        {/* Shared Users Section */}
        <div
          className="border-4 border-black p-8 mb-8"
          style={{ backgroundColor: 'var(--nb-card)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <UserPlus size={24} />
            <h2 className="text-2xl font-black">Shared With</h2>
          </div>

          {subscription.isShared ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-400">
              <p className="text-gray-600 font-semibold">
                This subscription is shared with you. Only the owner can manage shared users.
              </p>
            </div>
          ) : (
            <>
              {/* Add User Input */}
              <div className="mb-6">
                <label className="block font-bold mb-3 text-lg">Add People</label>
                <p className="text-sm text-gray-600 mb-3">
                  Share this subscription with others. They'll receive renewal reminders.
                </p>
                
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSharedUser()
                      }
                    }}
                    className="flex-1 px-5 py-3 border-2 border-black font-semibold focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="friend@example.com"
                    disabled={isAddingUser}
                  />
                  <button
                    type="button"
                    onClick={addSharedUser}
                    disabled={isAddingUser}
                    className="px-6 py-3 border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--nb-accent-2)' }}
                  >
                    <Plus size={20} />
                    {isAddingUser ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>

              {/* Shared Users List */}
              {subscription.sharedWith && subscription.sharedWith.length > 0 ? (
                <div>
                  <p className="font-bold mb-3">
                    {subscription.sharedWith.length} {subscription.sharedWith.length === 1 ? 'Person' : 'People'} Sharing
                  </p>
                  <div className="space-y-2">
                    {subscription.sharedWith.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between p-4 border-2 border-black"
                        style={{ backgroundColor: 'var(--nb-accent-2)' }}
                      >
                        <span className="font-semibold">{email}</span>
                        <button
                          onClick={() => removeSharedUser(email)}
                          className="p-2 hover:bg-black hover:text-white transition-colors border-2 border-black"
                          title="Remove user"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-400">
                  <p className="text-gray-600 font-semibold">
                    No one is sharing this subscription yet. Add people above!
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        {!subscription.isShared && (
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
        )}

        {subscription.isShared && (
          <div className="border-3 border-black p-6 mb-8 text-center" style={{ backgroundColor: 'var(--nb-warn)' }}>
            <p className="font-bold text-lg">
              📋 This is a shared subscription. Only the owner can modify or delete it.
            </p>
          </div>
        )}

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

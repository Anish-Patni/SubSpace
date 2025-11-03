import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X, Plus } from 'lucide-react'
import { BillingCycle } from '@/types/subscription'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { subscriptionService } from '@/services/subscriptionService'
import { aiService } from '@/services/aiService'

export const AddSubscription = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Manual form state
  const [formData, setFormData] = useState({
    serviceName: '',
    price: '',
    billingCycle: 'monthly' as BillingCycle,
    renewalDate: '',
    paymentMethod: '',
    category: '',
    notes: ''
  })

  // Shared users state
  const [sharedEmails, setSharedEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')

  // AI form state
  const [aiInput, setAiInput] = useState('')
  const [aiProcessing, setAiProcessing] = useState(false)

  const addSharedEmail = () => {
    const trimmedEmail = emailInput.trim()
    if (trimmedEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      if (!sharedEmails.includes(trimmedEmail)) {
        setSharedEmails([...sharedEmails, trimmedEmail])
        setEmailInput('')
      }
    }
  }

  const removeSharedEmail = (email: string) => {
    setSharedEmails(sharedEmails.filter(e => e !== email))
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await subscriptionService.create({
        serviceName: formData.serviceName,
        price: parseFloat(formData.price),
        billingCycle: formData.billingCycle,
        renewalDate: formData.renewalDate,
        paymentMethod: formData.paymentMethod || undefined,
        category: formData.category || undefined,
        notes: formData.notes || undefined,
        sharedWith: sharedEmails.length > 0 ? sharedEmails : undefined
      })
      
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Failed to add subscription:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAiProcess = async () => {
    if (!aiInput.trim()) {
      return
    }

    setAiProcessing(true)
    try {
      // Use the direct AI create endpoint - one step process!
      const subscription = await aiService.createSubscription(aiInput)
      console.log('AI create result:', subscription)
      
      // Send email notification from client-side
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (user.email) {
          const { emailService } = await import('@/services/emailService')
          await emailService.sendSubscriptionAddedEmail(user, subscription)
          console.log('✅ Email notification sent for AI-created subscription')
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the subscription creation if email fails
      }
      
      navigate('/dashboard')
    } catch (error: any) {
      console.error('AI create error:', error)
    } finally {
      setAiProcessing(false)
    }
  }


  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)', color: 'var(--nb-ink)' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 tracking-tight">Add Subscription</h1>
          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-600">
            Track your recurring payments with ease
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-4 sm:py-5 md:py-6 border-3 sm:border-4 border-black font-black text-base sm:text-xl md:text-2xl transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
              activeTab === 'manual' 
                ? 'translate-x-0 translate-y-0' 
                : 'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'
            }`}
            style={{ backgroundColor: activeTab === 'manual' ? 'var(--nb-accent)' : 'var(--nb-card)' }}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-4 sm:py-5 md:py-6 border-3 sm:border-4 border-black font-black text-base sm:text-xl md:text-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
              activeTab === 'ai' 
                ? 'translate-x-0 translate-y-0' 
                : 'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'
            }`}
            style={{ backgroundColor: activeTab === 'ai' ? 'var(--nb-accent-2)' : 'var(--nb-card)' }}
          >
            <Sparkles size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
            AI Assistant
          </button>
        </div>

        {/* Manual Entry Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-6 sm:space-y-8">
            <div className="border-3 sm:border-4 border-black p-6 sm:p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block font-bold mb-2 sm:mb-3 text-base sm:text-lg">Service Name</label>
                  <input
                    type="text"
                    required
                    value={formData.serviceName}
                    onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-black font-semibold text-base sm:text-lg focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="Netflix"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block font-bold mb-2 sm:mb-3 text-base sm:text-lg">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-black font-semibold text-base sm:text-lg focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="9.99"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 sm:mb-3 text-base sm:text-lg">Billing Cycle</label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({...formData, billingCycle: e.target.value as BillingCycle})}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-black font-semibold text-base sm:text-lg focus:outline-none focus:border-gray-400 transition-colors"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2 sm:mb-3 text-base sm:text-lg">Renewal Date</label>
                  <input
                    type="date"
                    required
                    value={formData.renewalDate}
                    onChange={(e) => setFormData({...formData, renewalDate: e.target.value})}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-black font-semibold text-base sm:text-lg focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block font-bold mb-2 sm:mb-3 text-base sm:text-lg">Payment Method (Optional todo)</label>
                    <input
                      type="text"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-black font-semibold text-base sm:text-lg focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="Visa ****1234"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 sm:mb-3 text-base sm:text-lg">Category (Optional)</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-black font-semibold text-base sm:text-lg focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="Entertainment, Productivity, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2 sm:mb-3 text-base sm:text-lg">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-black font-semibold text-base sm:text-lg focus:outline-none focus:border-gray-400 transition-colors resize-none"
                    rows={4}
                    placeholder="Any additional details..."
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                    Share with Others (Optional)
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Add email addresses of people who share this subscription. They'll receive notifications about renewals.
                  </p>
                  
                  <div className="flex gap-2 mb-3">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSharedEmail()
                        }
                      }}
                      className="flex-1 px-4 sm:px-5 py-3 sm:py-4 border-2 border-black font-semibold text-base sm:text-lg focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="friend@example.com"
                    />
                    <button
                      type="button"
                      onClick={addSharedEmail}
                      className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-black font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors"
                      style={{ backgroundColor: 'var(--nb-accent-2)' }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {sharedEmails.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sharedEmails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-black font-semibold text-sm sm:text-base"
                          style={{ backgroundColor: 'var(--nb-accent-2)' }}
                        >
                          <span className="break-all">{email}</span>
                          <button
                            type="button"
                            onClick={() => removeSharedEmail(email)}
                            className="hover:opacity-70 transition-opacity flex-shrink-0"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 sm:py-5 md:py-6 border-3 sm:border-4 border-black font-black text-lg sm:text-xl md:text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--nb-ok)', color: 'white' }}
            >
              {isSubmitting ? 'Saving...' : 'Save Subscription'}
            </button>
          </form>
        )}

        {/* AI Entry Form */}
        {activeTab === 'ai' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="border-3 sm:border-4 border-black p-6 sm:p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--nb-card)' }}>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block font-bold mb-2 sm:mb-3 text-base sm:text-lg">Describe Your Subscription</label>
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-black font-semibold text-base sm:text-lg focus:outline-none focus:border-gray-400 transition-colors resize-none"
                    rows={8}
                    placeholder="E.g., I pay $9.99 per month for Spotify Premium, renews on the 15th, charged to my Visa ending in 1234"
                  />
                  <p className="mt-3 text-sm text-gray-600">
                    Just describe your subscription in natural language and AI will extract the details for you.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleAiProcess}
              disabled={!aiInput || aiProcessing}
              className="w-full py-4 sm:py-5 md:py-6 border-3 sm:border-4 border-black font-black text-lg sm:text-xl md:text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 sm:gap-4"
              style={{ backgroundColor: 'var(--nb-accent-2)', color: 'white' }}
            >
              <Sparkles size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
              {aiProcessing ? 'AI Processing...' : 'Add with AI'}
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

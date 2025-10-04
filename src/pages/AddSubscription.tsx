import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { BillingCycle } from '@/types/subscription'
import { Navbar } from '@/components/Navbar'

export const AddSubscription = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual')
  
  // Manual form state
  const [formData, setFormData] = useState({
    serviceName: '',
    price: '',
    billingCycle: 'monthly' as BillingCycle,
    renewalDate: '',
    paymentMethod: '',
    notes: ''
  })

  // AI form state
  const [aiInput, setAiInput] = useState('')
  const [aiProcessing, setAiProcessing] = useState(false)
  const [aiExtracted, setAiExtracted] = useState<any>(null)

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Manual submission:', formData)
    navigate('/dashboard')
  }

  const handleAiProcess = async () => {
    setAiProcessing(true)
    // Simulate AI processing
    setTimeout(() => {
      setAiExtracted({
        serviceName: 'Example Service',
        price: '9.99',
        billingCycle: 'monthly',
        renewalDate: '2025-11-01',
        paymentMethod: 'Credit Card'
      })
      setAiProcessing(false)
    }, 1500)
  }

  const handleAiConfirm = () => {
    console.log('AI submission:', aiExtracted)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)', color: 'var(--nb-ink)' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-black mb-8">Add Subscription</h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-8 py-3 border-4 border-black font-bold text-lg transition-all ${
              activeTab === 'manual' 
                ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                : 'hover:translate-x-1 hover:translate-y-1'
            }`}
            style={{ backgroundColor: activeTab === 'manual' ? 'var(--nb-accent)' : 'var(--nb-card)' }}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-8 py-3 border-4 border-black font-bold text-lg transition-all flex items-center gap-2 ${
              activeTab === 'ai' 
                ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                : 'hover:translate-x-1 hover:translate-y-1'
            }`}
            style={{ backgroundColor: activeTab === 'ai' ? 'var(--nb-accent-2)' : 'var(--nb-card)' }}
          >
            <Sparkles size={20} /> AI Entry
          </button>
        </div>

        {/* Manual Entry Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div 
              className="border-4 border-black p-8 space-y-6"
              style={{ backgroundColor: 'var(--nb-card)' }}
            >
              <div>
                <label className="block font-bold mb-2 text-lg">Service Name</label>
                <input
                  type="text"
                  required
                  value={formData.serviceName}
                  onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                  className="w-full px-4 py-3 border-3 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  placeholder="e.g., Netflix"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2 text-lg">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border-3 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                    placeholder="9.99"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-lg">Billing Cycle</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({...formData, billingCycle: e.target.value as BillingCycle})}
                    className="w-full px-4 py-3 border-3 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2 text-lg">Renewal Date</label>
                  <input
                    type="date"
                    required
                    value={formData.renewalDate}
                    onChange={(e) => setFormData({...formData, renewalDate: e.target.value})}
                    className="w-full px-4 py-3 border-3 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-lg">Payment Method</label>
                  <input
                    type="text"
                    required
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-full px-4 py-3 border-3 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                    placeholder="Visa ****1234"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-2 text-lg">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border-3 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow resize-none"
                  rows={3}
                  placeholder="Any additional details..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 border-4 border-black font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              style={{ backgroundColor: 'var(--nb-ok)' }}
            >
              Save Subscription
            </button>
          </form>
        )}

        {/* AI Entry Form */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div 
              className="border-4 border-black p-8"
              style={{ backgroundColor: 'var(--nb-card)' }}
            >
              <label className="block font-bold mb-4 text-lg">Describe your subscription</label>
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="w-full px-4 py-3 border-3 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow resize-none"
                rows={6}
                placeholder="e.g., I pay $9.99 per month for Spotify Premium, renews on the 15th, charged to my Visa ending in 1234"
              />
              
              <button
                onClick={handleAiProcess}
                disabled={!aiInput || aiProcessing}
                className="mt-6 w-full py-4 border-4 border-black font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--nb-accent-2)' }}
              >
                <Sparkles size={24} />
                {aiProcessing ? 'Processing...' : 'Process with AI'}
              </button>
            </div>

            {/* AI Extracted Preview */}
            {aiExtracted && (
              <div 
                className="border-4 border-black p-8 space-y-4"
                style={{ backgroundColor: 'var(--nb-card)' }}
              >
                <h3 className="text-2xl font-black mb-4">Extracted Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-3 border-black p-4">
                    <p className="font-bold mb-1">Service Name</p>
                    <p className="text-lg">{aiExtracted.serviceName}</p>
                  </div>
                  <div className="border-3 border-black p-4">
                    <p className="font-bold mb-1">Price</p>
                    <p className="text-lg">${aiExtracted.price}</p>
                  </div>
                  <div className="border-3 border-black p-4">
                    <p className="font-bold mb-1">Billing Cycle</p>
                    <p className="text-lg">{aiExtracted.billingCycle}</p>
                  </div>
                  <div className="border-3 border-black p-4">
                    <p className="font-bold mb-1">Renewal Date</p>
                    <p className="text-lg">{aiExtracted.renewalDate}</p>
                  </div>
                  <div className="border-3 border-black p-4 md:col-span-2">
                    <p className="font-bold mb-1">Payment Method</p>
                    <p className="text-lg">{aiExtracted.paymentMethod}</p>
                  </div>
                </div>

                <button
                  onClick={handleAiConfirm}
                  className="w-full py-4 border-4 border-black font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  style={{ backgroundColor: 'var(--nb-ok)' }}
                >
                  Confirm and Add Subscription
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

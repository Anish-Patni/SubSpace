import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { BillingCycle } from '@/types/subscription'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { subscriptionService } from '@/services/subscriptionService'
import { aiService } from '@/services/aiService'
import { toast } from 'sonner'

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

  // AI form state
  const [aiInput, setAiInput] = useState('')
  const [aiProcessing, setAiProcessing] = useState(false)

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
        notes: formData.notes || undefined
      })
      
      toast.success('Subscription added successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add subscription')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAiProcess = async () => {
    if (!aiInput.trim()) {
      toast.error('Please enter a description')
      return
    }

    setAiProcessing(true)
    try {
      // Use the direct AI create endpoint - one step process!
      const result = await aiService.createSubscription(aiInput)
      console.log('AI create result:', result)
      
      toast.success('Subscription added successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('AI create error:', error)
      toast.error(error.response?.data?.error || 'Failed to process with AI')
    } finally {
      setAiProcessing(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-pink-50 to-yellow-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="relative">
            <h1 className="text-9xl font-black text-black mb-4 leading-none tracking-tighter">
              ADD
            </h1>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-neon-pink border-4 border-black transform rotate-12"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-neon-cyan border-4 border-black transform -rotate-12"></div>
          </div>
          <div className="relative">
            <h2 className="text-7xl font-black text-neon-purple mb-8 leading-none tracking-tighter">
              SUBSCRIPTION
            </h2>
            <div className="absolute top-0 -right-8 w-8 h-8 bg-neon-yellow border-4 border-black transform rotate-45"></div>
          </div>
          <p className="text-2xl font-bold text-gray-800 max-w-2xl">
            Track your recurring payments with brutal efficiency
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 gap-8 mb-16">
          <button
            onClick={() => setActiveTab('manual')}
            className={`relative py-8 border-6 border-black font-black text-3xl transition-all duration-200 ${
              activeTab === 'manual' 
                ? 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-neon-cyan transform -rotate-2' 
                : 'hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 bg-white hover:bg-neon-cyan/20'
            }`}
          >
            <span className="relative z-10">MANUAL</span>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-neon-pink border-4 border-black transform rotate-45"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-neon-yellow border-3 border-black transform -rotate-12"></div>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`relative py-8 border-6 border-black font-black text-3xl transition-all duration-200 flex items-center justify-center gap-4 ${
              activeTab === 'ai' 
                ? 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-neon-purple transform rotate-2' 
                : 'hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 bg-white hover:bg-neon-purple/20'
            }`}
          >
            <Sparkles size={32} className="relative z-10" />
            <span className="relative z-10">AI</span>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-neon-cyan border-4 border-black transform rotate-45"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-neon-pink border-3 border-black transform -rotate-12"></div>
          </button>
        </div>

        {/* Manual Entry Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-8">
            <div className="border-8 border-black bg-white p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <div className="bg-neon-yellow border-6 border-black p-6 mb-10 transform rotate-1">
                <h3 className="text-4xl font-black text-black">MANUAL ENTRY</h3>
                <div className="w-16 h-4 bg-neon-pink border-3 border-black mt-2 transform -rotate-2"></div>
              </div>
              
              <div className="space-y-10">
                <div>
                  <label className="block font-black mb-4 text-2xl text-black">SERVICE NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.serviceName}
                    onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                    className="w-full px-6 py-5 border-6 border-black font-black text-xl focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-neon-cyan/20"
                    placeholder="NETFLIX"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <label className="block font-black mb-4 text-2xl text-black">PRICE ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-6 py-5 border-6 border-black font-black text-xl focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-neon-pink/20"
                      placeholder="9.99"
                    />
                  </div>

                  <div>
                    <label className="block font-black mb-4 text-2xl text-black">BILLING CYCLE</label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({...formData, billingCycle: e.target.value as BillingCycle})}
                      className="w-full px-6 py-5 border-6 border-black font-black text-xl focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-neon-purple/20"
                    >
                      <option value="weekly">WEEKLY</option>
                      <option value="monthly">MONTHLY</option>
                      <option value="quarterly">QUARTERLY</option>
                      <option value="yearly">YEARLY</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-black mb-4 text-2xl text-black">RENEWAL DATE</label>
                  <input
                    type="date"
                    required
                    value={formData.renewalDate}
                    onChange={(e) => setFormData({...formData, renewalDate: e.target.value})}
                    className="w-full px-6 py-5 border-6 border-black font-black text-xl focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-neon-yellow/20"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <label className="block font-black mb-4 text-2xl text-black">PAYMENT METHOD (OPTIONAL)</label>
                    <input
                      type="text"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="w-full px-6 py-5 border-6 border-black font-black text-xl focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-neon-cyan/20"
                      placeholder="VISA ****1234"
                    />
                  </div>

                  <div>
                    <label className="block font-black mb-4 text-2xl text-black">CATEGORY (OPTIONAL)</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-6 py-5 border-6 border-black font-black text-xl focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-neon-pink/20"
                      placeholder="ENTERTAINMENT, PRODUCTIVITY, ETC."
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black mb-4 text-2xl text-black">NOTES (OPTIONAL)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-6 py-5 border-6 border-black font-black text-xl focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all resize-none bg-neon-purple/20"
                    rows={4}
                    placeholder="ANY ADDITIONAL DETAILS..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-16">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-8 border-8 border-black font-black text-4xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-neon-green transform rotate-1"
              >
                {isSubmitting ? 'SAVING...' : 'SAVE SUBSCRIPTION'}
              </button>
            </div>
          </form>
        )}

        {/* AI Entry Form */}
        {activeTab === 'ai' && (
          <div className="space-y-8">
            <div className="border-8 border-black bg-white p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              <div className="bg-neon-purple border-6 border-black p-6 mb-10 transform -rotate-1">
                <h3 className="text-4xl font-black text-white flex items-center gap-4">
                  <Sparkles size={40} />
                  AI ASSISTANT
                </h3>
                <div className="w-20 h-4 bg-neon-cyan border-3 border-black mt-2 transform rotate-2"></div>
              </div>
              
              <div className="space-y-10">
                <div>
                  <label className="block font-black mb-4 text-2xl text-black">DESCRIBE YOUR SUBSCRIPTION</label>
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="w-full px-6 py-5 border-6 border-black font-black text-xl focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all resize-none bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20"
                    rows={8}
                    placeholder="E.G., I PAY $9.99 PER MONTH FOR SPOTIFY PREMIUM, RENEWS ON THE 15TH, CHARGED TO MY VISA ENDING IN 1234"
                  />
                </div>
                
                <div className="mt-16">
                  <button
                    onClick={handleAiProcess}
                    disabled={!aiInput || aiProcessing}
                    className="w-full py-8 border-8 border-black font-black text-4xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-neon-pink to-neon-purple transform -rotate-1 flex items-center justify-center gap-6"
                  >
                    <Sparkles size={40} />
                    {aiProcessing ? 'AI PROCESSING...' : 'ADD WITH AI'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

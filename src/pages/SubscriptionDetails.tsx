import { useParams } from 'react-router-dom'
import { Pause, X, Edit, RefreshCw } from 'lucide-react'
import { Subscription } from '@/types/subscription'
import { Navbar } from '@/components/Navbar'

// Mock data - in real app, fetch by ID
const mockSubscription: Subscription = {
  id: '1',
  serviceName: 'Netflix',
  price: 15.99,
  billingCycle: 'monthly',
  renewalDate: '2025-10-15',
  paymentMethod: 'Visa ****1234',
  status: 'active',
  notes: 'Premium plan with 4K streaming',
  createdAt: '2024-01-01',
  totalSpent: 191.88
}

const paymentHistory = [
  { date: '2025-09-15', amount: 15.99, status: 'paid' },
  { date: '2025-08-15', amount: 15.99, status: 'paid' },
  { date: '2025-07-15', amount: 15.99, status: 'paid' },
  { date: '2025-06-15', amount: 15.99, status: 'paid' }
]

export const SubscriptionDetails = () => {
  const { id } = useParams()

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
              N
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2">{mockSubscription.serviceName}</h1>
              <div 
                className="inline-block px-4 py-1 border-2 border-black font-bold"
                style={{ backgroundColor: 'var(--nb-ok)' }}
              >
                {mockSubscription.status.toUpperCase()}
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
              <p className="text-2xl font-black">${mockSubscription.price}</p>
            </div>
            
            <div className="border-3 border-black p-4">
              <p className="font-bold mb-2">Billing Cycle</p>
              <p className="text-2xl font-black capitalize">{mockSubscription.billingCycle}</p>
            </div>
            
            <div className="border-3 border-black p-4">
              <p className="font-bold mb-2">Renewal Date</p>
              <p className="text-2xl font-black">{mockSubscription.renewalDate}</p>
            </div>
            
            <div className="border-3 border-black p-4">
              <p className="font-bold mb-2">Payment Method</p>
              <p className="text-2xl font-black">{mockSubscription.paymentMethod}</p>
            </div>
            
            {mockSubscription.notes && (
              <div className="border-3 border-black p-4 md:col-span-2">
                <p className="font-bold mb-2">Notes</p>
                <p className="text-lg">{mockSubscription.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <button 
            className="py-3 border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--nb-warn)' }}
          >
            <Pause size={20} /> Pause
          </button>
          
          <button 
            className="py-3 border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--nb-error)' }}
          >
            <X size={20} /> Cancel
          </button>
          
          <button 
            className="py-3 border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--nb-accent-2)' }}
          >
            <Edit size={20} /> Edit
          </button>
          
          <button 
            className="py-3 border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--nb-ok)' }}
          >
            <RefreshCw size={20} /> Renew
          </button>
        </div>

        {/* Stats Card */}
        <div 
          className="border-4 border-black p-8 mb-8"
          style={{ backgroundColor: 'var(--nb-card)' }}
        >
          <h2 className="text-2xl font-black mb-6">Statistics</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div 
              className="border-3 border-black p-6 text-center"
              style={{ backgroundColor: 'var(--nb-accent)' }}
            >
              <p className="font-bold mb-2">Total Spent</p>
              <p className="text-3xl font-black">${mockSubscription.totalSpent}</p>
            </div>
            
            <div 
              className="border-3 border-black p-6 text-center"
              style={{ backgroundColor: 'var(--nb-accent-2)' }}
            >
              <p className="font-bold mb-2">Payments Made</p>
              <p className="text-3xl font-black">{paymentHistory.length}</p>
            </div>
            
            <div 
              className="border-3 border-black p-6 text-center"
              style={{ backgroundColor: 'var(--nb-ok)' }}
            >
              <p className="font-bold mb-2">Next Payment</p>
              <p className="text-3xl font-black">11 days</p>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div 
          className="border-4 border-black p-8"
          style={{ backgroundColor: 'var(--nb-card)' }}
        >
          <h2 className="text-2xl font-black mb-6">Payment History</h2>
          
          <div className="space-y-3">
            {paymentHistory.map((payment, idx) => (
              <div 
                key={idx}
                className="border-3 border-black p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg">{payment.date}</p>
                  <p className="text-sm">Payment processed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">${payment.amount}</p>
                  <div 
                    className="inline-block px-3 py-1 border-2 border-black font-bold text-sm mt-1"
                    style={{ backgroundColor: 'var(--nb-ok)' }}
                  >
                    {payment.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

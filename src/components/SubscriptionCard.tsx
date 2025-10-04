import { Link } from 'react-router-dom'
import { Subscription } from '@/types/subscription'
import { Calendar, CreditCard } from 'lucide-react'

interface SubscriptionCardProps {
  subscription: Subscription
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const statusColors = {
    active: 'var(--nb-ok)',
    paused: 'var(--nb-warn)',
    canceled: 'var(--nb-error)'
  }

  return (
    <Link to={`/subscription/${subscription.id}`}>
      <div 
        className="border-4 border-black p-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer"
        style={{ backgroundColor: 'var(--nb-card)' }}
      >
        {/* Service Name & Status */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-black">{subscription.serviceName}</h3>
          <div 
            className="px-3 py-1 border-2 border-black font-bold text-xs"
            style={{ backgroundColor: statusColors[subscription.status] }}
          >
            {subscription.status.toUpperCase()}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-3xl font-black">${subscription.price}</p>
          <p className="text-sm font-bold opacity-70">per {subscription.billingCycle}</p>
        </div>

        {/* Details */}
        <div className="space-y-2 border-t-3 border-black pt-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="font-bold text-sm">Renews: {subscription.renewalDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={16} />
            <span className="font-bold text-sm">{subscription.paymentMethod}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

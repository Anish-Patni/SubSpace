export type SubscriptionStatus = 'active' | 'paused' | 'canceled'

export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly'

export interface Subscription {
  id: string
  serviceName: string
  price: number
  billingCycle: BillingCycle
  renewalDate: string
  paymentMethod: string
  status: SubscriptionStatus
  notes?: string
  logo?: string
  createdAt: string
  totalSpent?: number
}

export interface SubscriptionStats {
  totalMonthlySpend: number
  nextRenewal: string
  averageCost: number
  activeCount: number
}

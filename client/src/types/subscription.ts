export type SubscriptionStatus = 'active' | 'paused' | 'canceled'

export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly'

export interface Subscription {
  _id: string
  serviceName: string
  price: number
  billingCycle: BillingCycle
  renewalDate: string
  paymentMethod?: string
  category?: string
  status: SubscriptionStatus
  notes?: string
  createdAt: string
  userId: string
}

export interface SubscriptionStats {
  totalMonthly: string
  activeCount: number
  totalCount: number
  nextRenewal: string | null
}

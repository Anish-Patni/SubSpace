import axiosInstance from '@/utility/axiosInterceptor';
import { Subscription } from '@/types/subscription';

export interface CreateSubscriptionData {
  serviceName: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  renewalDate: string;
  paymentMethod?: string;
  category?: string;
  notes?: string;
  sharedWith?: string[];
}

export interface UpdateSubscriptionData extends Partial<CreateSubscriptionData> {
  status?: 'active' | 'paused' | 'canceled';
}

export interface SubscriptionStats {
  totalMonthly: string;
  activeCount: number;
  totalCount: number;
  nextRenewal: string | null;
}

export const subscriptionService = {
  async getAll(): Promise<Subscription[]> {
    const response = await axiosInstance.get('/subscriptions');
    return response.data;
  },

  async getById(id: string): Promise<Subscription> {
    const response = await axiosInstance.get(`/subscriptions/${id}`);
    return response.data;
  },

  async create(data: CreateSubscriptionData): Promise<Subscription> {
    const response = await axiosInstance.post('/subscriptions', data);
    return response.data;
  },

  async update(id: string, data: UpdateSubscriptionData): Promise<Subscription> {
    const response = await axiosInstance.put(`/subscriptions/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/subscriptions/${id}`);
  },

  async getStats(): Promise<SubscriptionStats> {
    const response = await axiosInstance.get('/subscriptions/stats/summary');
    return response.data;
  }
};

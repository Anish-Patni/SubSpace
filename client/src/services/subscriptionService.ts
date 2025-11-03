import axiosInstance from '@/utility/axiosInterceptor';
import { Subscription } from '@/types/subscription';
import { emailService } from './emailService';

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
    const subscription = response.data;
    
    // Send email notification from client-side
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.email) {
        await emailService.sendSubscriptionAddedEmail(user, subscription);
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Don't throw error - subscription was created successfully
    }
    
    return subscription;
  },

  async update(id: string, data: UpdateSubscriptionData): Promise<Subscription> {
    // Get the old subscription first to compare sharedWith changes
    let oldSharedWith: string[] = [];
    if (data.sharedWith) {
      try {
        const oldSubscription = await this.getById(id);
        oldSharedWith = oldSubscription.sharedWith || [];
      } catch (error) {
        console.error('Failed to get old subscription:', error);
      }
    }

    const response = await axiosInstance.put(`/subscriptions/${id}`, data);
    const subscription = response.data;
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.email) return subscription;

      // Send email notification if subscription was cancelled
      if (data.status === 'canceled') {
        try {
          await emailService.sendSubscriptionCancelledEmail(user, subscription);
        } catch (error) {
          console.error('Failed to send cancellation email:', error);
        }
      }

      // Send notifications for newly added shared users
      if (data.sharedWith) {
        const newSharedWith = data.sharedWith;
        const addedEmails = newSharedWith.filter(email => !oldSharedWith.includes(email));

        for (const email of addedEmails) {
          try {
            await emailService.sendSharedSubscriptionEmail(email, user, subscription);
            console.log(`✅ Sent shared subscription email to: ${email}`);
          } catch (error) {
            console.error(`Failed to send shared subscription email to ${email}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to process email notifications:', error);
    }
    
    return subscription;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/subscriptions/${id}`);
  },

  async getStats(): Promise<SubscriptionStats> {
    const response = await axiosInstance.get('/subscriptions/stats/summary');
    return response.data;
  },

  async checkReminders(): Promise<void> {
    try {
      const subscriptions = await this.getAll();
      const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.email && activeSubscriptions.length > 0) {
        await emailService.checkAndSendReminders(activeSubscriptions, user);
      }
    } catch (error) {
      console.error('Failed to check reminders:', error);
    }
  }
};

import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

interface Subscription {
  serviceName: string;
  price: number;
  billingCycle: string;
  renewalDate: string;
  paymentMethod?: string;
  status?: string;
}

interface User {
  email: string;
  name: string;
}

class EmailService {
  private isConfigured(): boolean {
    return !!(EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID);
  }

  private checkConfig(): void {
    if (!this.isConfigured()) {
      console.warn('⚠️ EmailJS not configured. Email notifications will not be sent.');
      console.warn('Please add VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, and VITE_EMAILJS_TEMPLATE_ID to your .env file');
    }
  }

  /**
   * Send a subscription added email
   */
  async sendSubscriptionAddedEmail(user: User, subscription: Subscription): Promise<void> {
    this.checkConfig();
    if (!this.isConfigured()) return;

    try {
      const templateParams = {
        to_email: user.email,
        to_name: user.name,
        subject: `✅ Subscription Added: ${subscription.serviceName}`,
        service_name: subscription.serviceName,
        amount: subscription.price,
        billing_cycle: subscription.billingCycle,
        renewal_date: new Date(subscription.renewalDate).toLocaleDateString(),
        payment_method: subscription.paymentMethod || 'N/A',
        message_type: 'subscription_added'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID!,
        EMAILJS_TEMPLATE_ID!,
        templateParams
      );

      console.log('✅ Subscription added email sent successfully:', response);
    } catch (error) {
      console.error('❌ Failed to send subscription added email:', error);
      throw error;
    }
  }

  /**
   * Send a renewal reminder email
   */
  async sendRenewalReminderEmail(
    user: User,
    subscription: Subscription,
    daysUntilRenewal: number
  ): Promise<void> {
    this.checkConfig();
    if (!this.isConfigured()) return;

    try {
      const templateParams = {
        to_email: user.email,
        to_name: user.name,
        subject: `⏰ Renewal Reminder: ${subscription.serviceName}`,
        service_name: subscription.serviceName,
        amount: subscription.price,
        renewal_date: new Date(subscription.renewalDate).toLocaleDateString(),
        payment_method: subscription.paymentMethod || 'N/A',
        days_until_renewal: daysUntilRenewal,
        message_type: 'renewal_reminder'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID!,
        EMAILJS_TEMPLATE_ID!,
        templateParams
      );

      console.log('✅ Renewal reminder email sent successfully:', response);
    } catch (error) {
      console.error('❌ Failed to send renewal reminder email:', error);
      throw error;
    }
  }

  /**
   * Send a subscription cancelled email
   */
  async sendSubscriptionCancelledEmail(user: User, subscription: Subscription): Promise<void> {
    this.checkConfig();
    if (!this.isConfigured()) return;

    try {
      const templateParams = {
        to_email: user.email,
        to_name: user.name,
        subject: `❌ Subscription Cancelled: ${subscription.serviceName}`,
        service_name: subscription.serviceName,
        amount: subscription.price,
        billing_cycle: subscription.billingCycle,
        message_type: 'subscription_cancelled'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID!,
        EMAILJS_TEMPLATE_ID!,
        templateParams
      );

      console.log('✅ Subscription cancelled email sent successfully:', response);
    } catch (error) {
      console.error('❌ Failed to send subscription cancelled email:', error);
      throw error;
    }
  }

  /**
   * Check for upcoming renewals and send reminders
   * This should be called periodically (e.g., on app load or user action)
   */
  async checkAndSendReminders(subscriptions: Subscription[], user: User): Promise<void> {
    this.checkConfig();
    if (!this.isConfigured()) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminderDays = [1, 3, 7];

    for (const subscription of subscriptions) {
      const renewalDate = new Date(subscription.renewalDate);
      renewalDate.setHours(0, 0, 0, 0);

      const diffTime = renewalDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Check if we should send a reminder
      if (reminderDays.includes(diffDays)) {
        try {
          await this.sendRenewalReminderEmail(user, subscription, diffDays);
          console.log(`✅ Sent ${diffDays}-day reminder for ${subscription.serviceName}`);
        } catch (error) {
          console.error(`❌ Failed to send ${diffDays}-day reminder:`, error);
        }
      }
    }
  }
}

export const emailService = new EmailService();

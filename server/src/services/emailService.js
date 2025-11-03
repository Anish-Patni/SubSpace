// Email Service - Disabled (Client-side only)
// All email functionality has been moved to the client-side using EmailJS browser SDK

class EmailService {
  constructor() {
    console.log('📧 EmailService: Email sending is now handled client-side');
  }

  // Stub methods - no actual email sending happens here
  async sendSubscriptionAddedEmail(user, subscription) {
    console.log('📧 [Client-side] Subscription added notification');
    return { success: true, message: 'Email handled by client' };
  }

  async sendRenewalReminderEmail(user, subscription, daysUntilRenewal) {
    console.log(`📧 [Client-side] ${daysUntilRenewal}-day reminder notification`);
    return { success: true, message: 'Email handled by client' };
  }

  async sendSharedSubscriptionEmail(sharedEmail, owner, subscription) {
    console.log('📧 [Client-side] Shared subscription notification');
    return { success: true, message: 'Email handled by client' };
  }

  async sendDailyDigest(user, subscriptions) {
    console.log('📧 [Client-side] Daily digest notification');
    return { success: true, message: 'Email handled by client' };
  }
}

const emailService = new EmailService();
export default emailService;

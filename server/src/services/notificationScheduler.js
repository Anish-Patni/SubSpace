import cron from 'node-cron';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import emailService from './emailService.js';

class NotificationScheduler {
  start() {
    // Run every day at 9 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('Running daily notification check...');
      await this.sendDailyReminders();
    });

    // Run every day at 8 AM for daily digest
    cron.schedule('0 8 * * *', async () => {
      console.log('Sending daily digest...');
      await this.sendDailyDigests();
    });

    console.log('✅ Notification scheduler started');
  }

  async sendDailyReminders() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get subscriptions renewing in 1, 3, or 7 days
      const reminderDays = [1, 3, 7];

      for (const days of reminderDays) {
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + days);
        
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const subscriptions = await Subscription.find({
          renewalDate: {
            $gte: targetDate,
            $lt: nextDay,
          },
          status: 'active',
        }).populate('userId');

        for (const subscription of subscriptions) {
          try {
            await emailService.sendRenewalReminderEmail(
              subscription.userId,
              subscription,
              days
            );
            console.log(`✅ Sent ${days}-day reminder for ${subscription.serviceName}`);
          } catch (error) {
            console.error(`❌ Failed to send reminder: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.error('Error in sendDailyReminders:', error);
    }
  }

  async sendDailyDigests() {
    try {
      const users = await User.find();

      for (const user of users) {
        const today = new Date();
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

        const upcomingSubscriptions = await Subscription.find({
          userId: user._id,
          status: 'active',
          renewalDate: {
            $gte: today,
            $lte: sevenDaysLater,
          },
        }).sort({ renewalDate: 1 });

        if (upcomingSubscriptions.length > 0) {
          await emailService.sendDailyDigest(user, upcomingSubscriptions);
          console.log(`✅ Sent daily digest to ${user.email}`);
        }
      }
    } catch (error) {
      console.error('Error in sendDailyDigests:', error);
    }
  }
}

const notificationScheduler = new NotificationScheduler();
export default notificationScheduler;

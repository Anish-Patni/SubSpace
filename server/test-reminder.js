import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import Subscription from './src/models/Subscription.js';
import User from './src/models/User.js';
import emailService from './src/services/emailService.js';

dotenv.config();

console.log('=== Manual Reminder Test ===\n');

// Connect to database
await connectDB();

async function testReminders() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check for subscriptions renewing in 1 day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    console.log('Checking for subscriptions renewing on:', tomorrow.toDateString());
    
    const subscriptions = await Subscription.find({
      renewalDate: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow,
      },
      status: 'active',
    }).populate('userId');

    console.log(`Found ${subscriptions.length} subscription(s) renewing tomorrow\n`);

    if (subscriptions.length === 0) {
      console.log('💡 TIP: Add a subscription with renewal date set to tomorrow to test the reminder email!');
      console.log('   Tomorrow\'s date:', tomorrow.toISOString().split('T')[0]);
    }

    for (const subscription of subscriptions) {
      try {
        console.log(`📧 Sending reminder for: ${subscription.serviceName}`);
        console.log(`   To: ${subscription.userId.email}`);
        console.log(`   Amount: $${subscription.price}`);
        console.log(`   Renewal: ${new Date(subscription.renewalDate).toDateString()}\n`);
        
        await emailService.sendRenewalReminderEmail(
          subscription.userId,
          subscription,
          1 // 1 day reminder
        );
        
        console.log(`✅ Sent 1-day reminder for ${subscription.serviceName}\n`);
      } catch (error) {
        console.error(`❌ Failed to send reminder: ${error.message}\n`);
      }
    }

    console.log('=== Test Complete ===');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testReminders();

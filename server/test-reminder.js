import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import Subscription from './src/models/Subscription.js';
import User from './src/models/User.js';

dotenv.config();

console.log('=== Email Reminder Test ===\n');
console.log('⚠️  EMAIL NOTIFICATIONS ARE NOW CLIENT-SIDE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

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
      console.log('💡 TIP: Add a subscription with renewal date set to tomorrow to test reminders!');
      console.log('   Tomorrow\'s date:', tomorrow.toISOString().split('T')[0]);
      console.log('\n📧 Email notifications will be sent automatically when:');
      console.log('   1. User adds a new subscription (client-side)');
      console.log('   2. User logs into the app and has upcoming renewals (client-side)');
      console.log('   3. User manually checks for reminders (client-side)\n');
    } else {
      console.log('📧 Email Notifications (Client-Side):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      for (const subscription of subscriptions) {
        console.log(`📌 Subscription: ${subscription.serviceName}`);
        console.log(`   User: ${subscription.userId.email}`);
        console.log(`   Amount: $${subscription.price}`);
        console.log(`   Renewal: ${new Date(subscription.renewalDate).toDateString()}`);
        console.log(`   ✉️  Reminder email will be sent from client when user logs in\n`);
      }

      console.log('\n🔧 HOW TO TEST EMAIL NOTIFICATIONS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('1. Make sure you have EmailJS configured in client/.env:');
      console.log('   - VITE_EMAILJS_PUBLIC_KEY');
      console.log('   - VITE_EMAILJS_SERVICE_ID');
      console.log('   - VITE_EMAILJS_TEMPLATE_ID\n');
      console.log('2. Log into the app as:', subscriptions[0].userId.email);
      console.log('3. The app will automatically check and send reminder emails');
      console.log('4. Or call subscriptionService.checkReminders() manually\n');
    }

    console.log('=== Test Complete ===');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testReminders();

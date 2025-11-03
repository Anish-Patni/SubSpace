/**
 * EmailJS Test Script
 * 
 * Run this with: npx tsx test-email-service.ts
 * 
 * Make sure to set these environment variables in client/.env:
 * - VITE_EMAILJS_PUBLIC_KEY
 * - VITE_EMAILJS_SERVICE_ID
 * - VITE_EMAILJS_TEMPLATE_ID
 */

import { emailService } from './src/services/emailService';

// Test data
const testUser = {
  email: 'amrit2005@gmail.com', // Change this to your email
  name: 'Test User',
};

const testSubscription = {
  serviceName: 'Netflix',
  price: 15.99,
  billingCycle: 'monthly',
  renewalDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  paymentMethod: 'Credit Card',
  status: 'active',
};

async function runTests() {
  console.log('=== EmailJS Client-Side Test ===\n');
  console.log('Environment Check:');
  console.log('VITE_EMAILJS_PUBLIC_KEY:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? '✓ Set' : '✗ Missing');
  console.log('VITE_EMAILJS_SERVICE_ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID ? '✓ Set' : '✗ Missing');
  console.log('VITE_EMAILJS_TEMPLATE_ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID ? '✓ Set' : '✗ Missing');
  console.log('\n');

  if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 
      !import.meta.env.VITE_EMAILJS_SERVICE_ID || 
      !import.meta.env.VITE_EMAILJS_TEMPLATE_ID) {
    console.error('❌ EmailJS not configured! Please set environment variables in .env file.');
    console.log('\nRequired variables:');
    console.log('VITE_EMAILJS_PUBLIC_KEY=your_public_key');
    console.log('VITE_EMAILJS_SERVICE_ID=your_service_id');
    console.log('VITE_EMAILJS_TEMPLATE_ID=your_template_id');
    return;
  }

  console.log('Test User:', testUser.email);
  console.log('Test Subscription:', testSubscription.serviceName);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 1: Subscription Added Email
  console.log('Test 1: Sending Subscription Added Email...');
  try {
    await emailService.sendSubscriptionAddedEmail(testUser, testSubscription);
    console.log('✅ Subscription added email sent!\n');
  } catch (error: any) {
    console.error('❌ Failed:', error.message || error);
    console.log('\n');
  }

  // Wait a bit between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: 1-Day Renewal Reminder
  console.log('Test 2: Sending 1-Day Renewal Reminder...');
  try {
    await emailService.sendRenewalReminderEmail(testUser, testSubscription, 1);
    console.log('✅ 1-day reminder sent!\n');
  } catch (error: any) {
    console.error('❌ Failed:', error.message || error);
    console.log('\n');
  }

  // Wait a bit between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: 3-Day Renewal Reminder
  console.log('Test 3: Sending 3-Day Renewal Reminder...');
  try {
    const subscription3Days = {
      ...testSubscription,
      renewalDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    };
    await emailService.sendRenewalReminderEmail(testUser, subscription3Days, 3);
    console.log('✅ 3-day reminder sent!\n');
  } catch (error: any) {
    console.error('❌ Failed:', error.message || error);
    console.log('\n');
  }

  // Wait a bit between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 4: 7-Day Renewal Reminder
  console.log('Test 4: Sending 7-Day Renewal Reminder...');
  try {
    const subscription7Days = {
      ...testSubscription,
      renewalDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    };
    await emailService.sendRenewalReminderEmail(testUser, subscription7Days, 7);
    console.log('✅ 7-day reminder sent!\n');
  } catch (error: any) {
    console.error('❌ Failed:', error.message || error);
    console.log('\n');
  }

  // Wait a bit between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 5: Subscription Cancelled Email
  console.log('Test 5: Sending Subscription Cancelled Email...');
  try {
    await emailService.sendSubscriptionCancelledEmail(testUser, testSubscription);
    console.log('✅ Cancellation email sent!\n');
  } catch (error: any) {
    console.error('❌ Failed:', error.message || error);
    console.log('\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n=== Test Complete ===');
  console.log('\n📬 Check your email inbox:', testUser.email);
  console.log('   You should have received 5 test emails');
  console.log('\n💡 TIP: If you didn\'t receive emails, check:');
  console.log('   1. Spam folder');
  console.log('   2. EmailJS dashboard for errors');
  console.log('   3. Browser console for error messages');
  console.log('   4. EmailJS template configuration');
}

// Run tests
runTests().catch(console.error);

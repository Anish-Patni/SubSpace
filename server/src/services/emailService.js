import nodemailer from 'nodemailer';
import ical from 'ical-generator';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (!this.transporter) {
      console.log('🔧 Initializing email transporter...');
      console.log('   EMAIL_HOST:', process.env.EMAIL_HOST);
      console.log('   EMAIL_PORT:', process.env.EMAIL_PORT);
      console.log('   EMAIL_USER:', process.env.EMAIL_USER);
      console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***set***' : 'NOT SET');
      
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    return this.transporter;
  }

  // Generate calendar event
  generateCalendarEvent(subscription) {
    const calendar = ical({ name: 'SubSpace Subscription' });
    
    const renewalDate = new Date(subscription.renewalDate);
    
    calendar.createEvent({
      start: renewalDate,
      end: new Date(renewalDate.getTime() + 60 * 60 * 1000), // 1 hour duration
      summary: `${subscription.serviceName} Renewal - $${subscription.price}`,
      description: `Your ${subscription.serviceName} subscription (${subscription.billingCycle}) will renew today.\n\nAmount: $${subscription.price}\nPayment Method: ${subscription.paymentMethod}\nCategory: ${subscription.category}`,
      location: 'SubSpace App',
      url: `${process.env.APP_URL}/dashboard`,
      organizer: {
        name: 'SubSpace',
        email: process.env.EMAIL_FROM,
      },
    });

    return calendar.toString();
  }

  // Send subscription added email with calendar invite
  async sendSubscriptionAddedEmail(user, subscription) {
    console.log('📧 EmailService: sendSubscriptionAddedEmail called');
    console.log('   To:', user.email);
    console.log('   Subscription:', subscription.serviceName);
    
    const calendarEvent = this.generateCalendarEvent(subscription);
    console.log('   Calendar event generated');

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `✅ Subscription Added: ${subscription.serviceName}`,
      html: `
        <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #1A1A1A; padding: 20px; background-color: #F7F5F2;">
          <h1 style="color: #1A1A1A; border-bottom: 3px solid #FF6F61; padding-bottom: 10px;">
            📅 Subscription Added
          </h1>
          
          <div style="background-color: #90EE90; border: 3px solid #1A1A1A; padding: 15px; margin: 20px 0;">
            <h2 style="margin: 0; color: #1A1A1A;">${subscription.serviceName}</h2>
            <p style="margin: 10px 0;"><strong>Amount:</strong> $${subscription.price}</p>
            <p style="margin: 10px 0;"><strong>Billing Cycle:</strong> ${subscription.billingCycle}</p>
            <p style="margin: 10px 0;"><strong>Next Renewal:</strong> ${new Date(subscription.renewalDate).toLocaleDateString()}</p>
            <p style="margin: 10px 0;"><strong>Payment Method:</strong> ${subscription.paymentMethod}</p>
          </div>

          <p style="color: #1A1A1A;">
            A calendar event has been attached to this email. Add it to your calendar to get reminders!
          </p>

          <a href="${process.env.APP_URL}/dashboard" 
             style="display: inline-block; background-color: #FF6F61; color: white; padding: 12px 24px; text-decoration: none; border: 3px solid #1A1A1A; font-weight: bold; margin-top: 20px;">
            View Dashboard
          </a>

          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            Manage your subscriptions at <a href="${process.env.APP_URL}">${process.env.APP_URL}</a>
          </p>
        </div>
      `,
      icalEvent: {
        filename: 'subscription-renewal.ics',
        method: 'request',
        content: calendarEvent,
      },
    };

    console.log('   Sending email...');
    const result = await this.getTransporter().sendMail(mailOptions);
    console.log('   ✅ Email sent successfully! MessageId:', result.messageId);
    return result;
  }

  // Send renewal reminder email
  async sendRenewalReminderEmail(user, subscription, daysUntilRenewal) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `⏰ Reminder: ${subscription.serviceName} renews in ${daysUntilRenewal} day(s)`,
      html: `
        <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #1A1A1A; padding: 20px; background-color: #F7F5F2;">
          <h1 style="color: #1A1A1A; border-bottom: 3px solid #F4D738; padding-bottom: 10px;">
            ⏰ Renewal Reminder
          </h1>
          
          <div style="background-color: #F4D738; border: 3px solid #1A1A1A; padding: 15px; margin: 20px 0;">
            <h2 style="margin: 0; color: #1A1A1A;">${subscription.serviceName}</h2>
            <p style="margin: 10px 0; font-size: 18px;"><strong>Renews in ${daysUntilRenewal} day(s)</strong></p>
            <p style="margin: 10px 0;"><strong>Amount:</strong> $${subscription.price}</p>
            <p style="margin: 10px 0;"><strong>Renewal Date:</strong> ${new Date(subscription.renewalDate).toLocaleDateString()}</p>
            <p style="margin: 10px 0;"><strong>Payment Method:</strong> ${subscription.paymentMethod}</p>
          </div>

          <p style="color: #1A1A1A;">
            Make sure your payment method is up to date!
          </p>

          <a href="${process.env.APP_URL}/dashboard" 
             style="display: inline-block; background-color: #FF6F61; color: white; padding: 12px 24px; text-decoration: none; border: 3px solid #1A1A1A; font-weight: bold; margin-top: 20px;">
            Manage Subscription
          </a>
        </div>
      `,
    };

    await this.getTransporter().sendMail(mailOptions);
  }

  // Send daily digest of upcoming renewals
  async sendDailyDigest(user, subscriptions) {
    if (subscriptions.length === 0) return;

    const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

    const subscriptionList = subscriptions
      .map(
        (sub) => `
        <div style="background-color: #C4A1FF; border: 2px solid #1A1A1A; padding: 10px; margin: 10px 0;">
          <strong>${sub.serviceName}</strong> - $${sub.price}<br>
          Renews: ${new Date(sub.renewalDate).toLocaleDateString()}
        </div>
      `
      )
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `📊 Daily Digest: ${subscriptions.length} Upcoming Renewals`,
      html: `
        <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #1A1A1A; padding: 20px; background-color: #F7F5F2;">
          <h1 style="color: #1A1A1A; border-bottom: 3px solid #90EE90; padding-bottom: 10px;">
            📊 Your Daily Subscription Digest
          </h1>
          
          <p style="font-size: 16px; color: #1A1A1A;">
            You have <strong>${subscriptions.length}</strong> subscription(s) renewing in the next 7 days.
          </p>

          <div style="background-color: #90EE90; border: 3px solid #1A1A1A; padding: 15px; margin: 20px 0;">
            <h2 style="margin: 0;">Total Amount: $${totalAmount.toFixed(2)}</h2>
          </div>

          ${subscriptionList}

          <a href="${process.env.APP_URL}/calendar" 
             style="display: inline-block; background-color: #FF6F61; color: white; padding: 12px 24px; text-decoration: none; border: 3px solid #1A1A1A; font-weight: bold; margin-top: 20px;">
            View Calendar
          </a>
        </div>
      `,
    };

    await this.getTransporter().sendMail(mailOptions);
  }
}

const emailService = new EmailService();
export default emailService;

import express from 'express';
import { body, validationResult } from 'express-validator';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import emailService from '../services/emailService.js';
import ical from 'ical-generator';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all subscriptions for user
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single subscription
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create subscription
router.post('/',
  body('serviceName').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('billingCycle').isIn(['monthly', 'yearly', 'weekly', 'quarterly']),
  body('renewalDate').isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('=== SUBSCRIPTION CREATE VALIDATION ERROR ===');
      console.log('Errors:', errors.array());
      console.log('Request body:', req.body);
      console.log('==========================================');
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('=== CREATING SUBSCRIPTION ===');
      console.log('User ID:', req.userId);
      console.log('Request body:', req.body);
      
      const subscription = new Subscription({
        ...req.body,
        userId: req.userId
      });
      
      console.log('Subscription object before save:', subscription);
      await subscription.save();
      console.log('Subscription saved successfully:', subscription._id);
      
      // Send confirmation email with calendar invite
      console.log('=== ATTEMPTING TO SEND EMAIL ===');
      try {
        console.log('Looking up user:', req.userId);
        const user = await User.findById(req.userId);
        console.log('User found:', user ? user.email : 'NO USER');
        
        if (user) {
          console.log('Calling emailService.sendSubscriptionAddedEmail...');
          await emailService.sendSubscriptionAddedEmail(user, subscription);
          console.log('✅ Confirmation email sent to:', user.email);
        } else {
          console.log('⚠️ User not found, cannot send email');
        }
      } catch (emailError) {
        console.error('⚠️ Failed to send email:', emailError.message);
        console.error('Email error stack:', emailError.stack);
        // Don't fail the request if email fails
      }
      console.log('=== EMAIL PROCESS COMPLETE ===');
      
      console.log('============================');
      
      res.status(201).json(subscription);
    } catch (error) {
      console.error('=== SUBSCRIPTION CREATE ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      console.error('================================');
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update subscription
router.put('/:id',
  body('serviceName').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('billingCycle').optional().isIn(['monthly', 'yearly', 'weekly', 'quarterly']),
  body('renewalDate').optional().isISO8601(),
  body('status').optional().isIn(['active', 'paused', 'canceled']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const subscription = await Subscription.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }
      
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete subscription
router.delete('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get subscription stats
router.get('/stats/summary', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId });
    
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    
    const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
      let monthlyPrice = sub.price;
      if (sub.billingCycle === 'yearly') monthlyPrice = sub.price / 12;
      if (sub.billingCycle === 'weekly') monthlyPrice = sub.price * 4;
      if (sub.billingCycle === 'quarterly') monthlyPrice = sub.price / 3;
      return sum + monthlyPrice;
    }, 0);

    const nextRenewal = activeSubscriptions
      .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))[0];

    res.json({
      totalMonthly: totalMonthly.toFixed(2),
      activeCount: activeSubscriptions.length,
      totalCount: subscriptions.length,
      nextRenewal: nextRenewal ? nextRenewal.renewalDate : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Export all subscriptions as .ics calendar file
router.get('/export/calendar', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId });

    const calendar = ical({ name: 'SubSpace Subscriptions' });

    subscriptions.forEach((sub) => {
      const event = calendar.createEvent({
        start: new Date(sub.renewalDate),
        end: new Date(new Date(sub.renewalDate).getTime() + 60 * 60 * 1000),
        summary: `${sub.serviceName} Renewal - $${sub.price}`,
        description: `${sub.billingCycle} subscription renewal\nPayment Method: ${sub.paymentMethod}\nCategory: ${sub.category}`,
        location: 'SubSpace App',
        url: `${process.env.APP_URL}/dashboard`,
      });

      // Add recurring rule based on billing cycle
      if (sub.billingCycle === 'monthly') {
        event.repeating({ freq: 'MONTHLY' });
      } else if (sub.billingCycle === 'yearly') {
        event.repeating({ freq: 'YEARLY' });
      } else if (sub.billingCycle === 'weekly') {
        event.repeating({ freq: 'WEEKLY' });
      } else if (sub.billingCycle === 'quarterly') {
        event.repeating({ freq: 'MONTHLY', interval: 3 });
      }
    });

    res.set({
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="subscriptions.ics"',
    });

    res.send(calendar.toString());
  } catch (error) {
    console.error('Calendar export error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

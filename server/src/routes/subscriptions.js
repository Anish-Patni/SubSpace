import express from 'express';
import { body, validationResult } from 'express-validator';
import Subscription from '../models/Subscription.js';
import { authenticate } from '../middleware/auth.js';

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
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const subscription = new Subscription({
        ...req.body,
        userId: req.userId
      });
      
      await subscription.save();
      res.status(201).json(subscription);
    } catch (error) {
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

export default router;

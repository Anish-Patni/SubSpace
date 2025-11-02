import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { extractSubscriptionData } from '../services/aiService.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import emailService from '../services/emailService.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Extract subscription data from natural language
router.post('/extract',
  body('input').trim().notEmpty().withMessage('Input text is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { input } = req.body;
      console.log('=== AI EXTRACT ENDPOINT ===');
      console.log('User ID:', req.userId);
      console.log('Input:', input);
      
      const extractedData = await extractSubscriptionData(input);
      console.log('Extracted data:', extractedData);
      console.log('========================');
      
      res.json(extractedData);
    } catch (error) {
      console.error('=== AI EXTRACT ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Request body:', req.body);
      console.error('User ID:', req.userId);
      console.error('=====================');
      res.status(500).json({ error: error.message || 'Failed to process AI request' });
    }
  }
);

// Extract and create subscription from natural language
router.post('/create',
  body('input').trim().notEmpty().withMessage('Input text is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { input } = req.body;
      console.log('=== AI CREATE ENDPOINT ===');
      console.log('User ID:', req.userId);
      console.log('Input:', input);
      
      // Extract subscription data using AI
      const extractedData = await extractSubscriptionData(input);
      console.log('Extracted data received in route:', extractedData);
      
      // Validate extracted data using the same validation as regular subscription creation
      const validationErrors = [];
      
      if (!extractedData.serviceName || extractedData.serviceName.trim() === '') {
        validationErrors.push({ msg: 'Service name is required', param: 'serviceName' });
      }
      
      if (!extractedData.price || isNaN(extractedData.price) || extractedData.price < 0) {
        validationErrors.push({ msg: 'Valid price is required', param: 'price' });
      }
      
      if (!extractedData.billingCycle || !['monthly', 'yearly', 'weekly', 'quarterly'].includes(extractedData.billingCycle)) {
        validationErrors.push({ msg: 'Valid billing cycle is required', param: 'billingCycle' });
      }
      
      if (!extractedData.renewalDate) {
        validationErrors.push({ msg: 'Renewal date is required', param: 'renewalDate' });
      }
      
      if (validationErrors.length > 0) {
        console.log('=== AI VALIDATION ERRORS ===');
        console.log('Errors:', validationErrors);
        console.log('============================');
        return res.status(400).json({ errors: validationErrors });
      }
      
      // Create subscription using the same logic as regular subscription creation
      const subscriptionData = {
        serviceName: extractedData.serviceName.trim(),
        price: parseFloat(extractedData.price),
        billingCycle: extractedData.billingCycle,
        renewalDate: new Date(extractedData.renewalDate),
        paymentMethod: extractedData.paymentMethod || undefined,
        category: extractedData.category || undefined,
        notes: extractedData.notes || undefined,
        userId: req.userId
      };
      
      console.log('=== CREATING AI SUBSCRIPTION ===');
      console.log('User ID:', req.userId);
      console.log('Subscription data:', subscriptionData);
      
      const subscription = new Subscription(subscriptionData);
      
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
      
      console.log('===============================');
      
      res.status(201).json(subscription);
    } catch (error) {
      console.error('=== AI CREATE ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Request body:', req.body);
      console.error('User ID:', req.userId);
      console.error('=====================');
      
      // Handle validation errors specifically
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.message,
          field: error.path 
        });
      }
      
      res.status(500).json({ error: error.message || 'Failed to create subscription' });
    }
  }
);

export default router;

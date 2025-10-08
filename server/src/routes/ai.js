import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { extractSubscriptionData } from '../services/aiService.js';

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
      const extractedData = await extractSubscriptionData(input);
      res.json(extractedData);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Failed to process AI request' });
    }
  }
);

export default router;

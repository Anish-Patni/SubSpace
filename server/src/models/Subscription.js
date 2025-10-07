import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'weekly', 'quarterly'],
    required: true
  },
  renewalDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'canceled'],
    default: 'active'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Subscription', subscriptionSchema);

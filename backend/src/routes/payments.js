import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  getRazorpayKey
} from '../controllers/paymentController.js';

const router = express.Router();

// Apply authentication to all payment routes
router.use(authenticateToken);

// @route   GET /api/payments/key
// @desc    Get Razorpay public key
// @access  Private
router.get('/key', getRazorpayKey);

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order for payment
// @access  Private
router.post('/create-order', createPaymentOrder);

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', verifyPayment);

// @route   POST /api/payments/failed
// @desc    Handle payment failure
// @access  Private
router.post('/failed', handlePaymentFailure);

export default router;

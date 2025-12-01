import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import { orderLimiter } from '../middleware/rateLimiting.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  trackOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Apply authentication to all order routes
router.use(authenticateToken);

// @route   POST /api/orders
// @desc    Create new order from cart
// @access  Private
router.post('/', orderLimiter, createOrder);

// @route   GET /api/orders
// @desc    Get user orders with pagination
// @access  Private
router.get('/', getUserOrders);

// @route   GET /api/orders/:orderId
// @desc    Get specific order details
// @access  Private
router.get('/:orderId', getOrderById);

// @route   PUT /api/orders/:orderId/cancel
// @desc    Cancel order and restore stock
// @access  Private
router.put('/:orderId/cancel', cancelOrder);

// @route   GET /api/orders/:orderId/track
// @desc    Track order status
// @access  Private
router.get('/:orderId/track', trackOrder);

export default router;
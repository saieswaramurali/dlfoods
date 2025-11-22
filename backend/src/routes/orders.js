import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import { orderLimiter } from '../middleware/rateLimiting.js';
import OrderService from '../services/orderService.js';
import emailService from '../services/emailService.js';

const router = express.Router();

// Apply authentication to all order routes
router.use(authenticateToken);

// @route   POST /api/orders
// @desc    Create new order from cart
// @access  Private
router.post('/', orderLimiter, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes, couponCode } = req.body;

    // Validate required fields
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || 
        !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Create order using atomic service
    const order = await OrderService.createOrder(req.user._id, {
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      notes,
      couponCode
    });

    // Send order confirmation email asynchronously (non-blocking)
    setImmediate(async () => {
      try {
        await emailService.sendOrderConfirmationEmail(req.user, order);
      } catch (emailError) {
        console.log('Failed to send order confirmation email:', emailError.message);
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order: {
          orderId: order.orderId,
          status: order.status,
          total: order.pricing.total,
          items: order.items.length,
          paymentMethod: order.paymentDetails.method,
          estimatedDelivery: order.estimatedDelivery
        }
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    
    // Handle specific errors
    if (error.message.includes('Cart is empty')) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items before placing an order.'
      });
    }
    
    if (error.message.includes('Insufficient stock')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.'
    });
  }
});

// @route   GET /api/orders
// @desc    Get user orders with pagination
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await OrderService.getUserOrders(
      req.user._id, 
      parseInt(page), 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// @route   GET /api/orders/:orderId
// @desc    Get specific order details
// @access  Private
router.get('/:orderId', async (req, res) => {
  try {
    const order = await OrderService.getOrderById(
      req.params.orderId, 
      req.user._id
    );

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
});

// @route   PUT /api/orders/:orderId/cancel
// @desc    Cancel order and restore stock
// @access  Private
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Cancellation reason is required'
      });
    }

    const order = await OrderService.cancelOrder(
      req.params.orderId, 
      req.user._id, 
      reason.trim()
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    if (error.message.includes('cannot be cancelled')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
});

// @route   GET /api/orders/:orderId/track
// @desc    Track order status
// @access  Private
router.get('/:orderId/track', async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      userId: req.user._id
    })
    .select('orderId status tracking createdAt deliveredAt')
    .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Generate tracking timeline
    const timeline = [
      {
        status: 'pending',
        message: 'Order placed successfully',
        timestamp: order.createdAt,
        completed: true
      },
      {
        status: 'confirmed',
        message: 'Order confirmed',
        timestamp: order.tracking.updates.find(u => u.status === 'confirmed')?.timestamp,
        completed: ['confirmed', 'preparing', 'shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'preparing',
        message: 'Order is being prepared',
        timestamp: order.tracking.updates.find(u => u.status === 'preparing')?.timestamp,
        completed: ['preparing', 'shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'shipped',
        message: 'Order shipped',
        timestamp: order.tracking.updates.find(u => u.status === 'shipped')?.timestamp,
        completed: ['shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'delivered',
        message: 'Order delivered',
        timestamp: order.deliveredAt,
        completed: order.status === 'delivered'
      }
    ];

    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        currentStatus: order.status,
        trackingId: order.tracking.trackingId,
        estimatedDelivery: order.tracking.estimatedDelivery,
        timeline,
        updates: order.tracking.updates
      }
    });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
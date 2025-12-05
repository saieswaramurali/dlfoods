import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import emailService from '../services/emailService.js';

// Lazy initialization of Razorpay instance
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpayInstance;
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress, notes } = req.body;
    const userId = req.user._id;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || 
        !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;
      
      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.primaryImage || product.images?.[0] || ''
      });
    }

    // Calculate shipping (free over ₹500)
    const shipping = subtotal >= 500 ? 0 : 50;
    const total = subtotal + shipping;

    // Convert to paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(total * 100);

    // Generate orderId before creating order
    const orderCount = await Order.countDocuments();
    const generatedOrderId = `DLF${String(orderCount + 1).padStart(6, '0')}`;

    // Create Razorpay order
    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: generatedOrderId,
      notes: {
        userId: userId.toString(),
        orderId: generatedOrderId,
        shipping_name: shippingAddress.fullName,
        shipping_city: shippingAddress.city
      }
    });

    // Create pending order in database
    const order = new Order({
      orderId: generatedOrderId,
      userId,
      items: orderItems,
      pricing: {
        subtotal,
        shipping,
        tax: 0,
        discount: 0,
        total
      },
      status: 'pending',
      shippingAddress,
      paymentDetails: {
        method: 'razorpay',
        status: 'pending',
        razorpayOrderId: razorpayOrder.id
      },
      notes: notes || ''
    });

    await order.save();

    res.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        orderId: order.orderId,
        keyId: process.env.RAZORPAY_KEY_ID,
        prefill: {
          name: shippingAddress.fullName,
          email: req.user.email,
          contact: shippingAddress.phone
        }
      }
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    // Find the order
    const order = await Order.findOne({ 
      orderId, 
      userId: req.user._id,
      'paymentDetails.razorpayOrderId': razorpay_order_id 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // Update order payment status to failed
      order.paymentDetails.status = 'failed';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    // Payment is verified - update order (keep status as pending for admin to confirm)
    order.paymentDetails.status = 'completed';
    order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails.razorpaySignature = razorpay_signature;
    order.paymentDetails.paidAt = new Date();
    // Status remains 'pending' - admin will manually confirm

    // Add tracking update
    order.tracking.updates.push({
      status: 'pending',
      message: 'Payment received successfully. Order awaiting confirmation.',
      timestamp: new Date()
    });

    await order.save();

    // Reduce stock for each item
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } }
    );

    // Send order confirmation email asynchronously
    setImmediate(async () => {
      try {
        await emailService.sendOrderConfirmationEmail(req.user, order);
      } catch (emailError) {
        console.log('Failed to send order confirmation email:', emailError.message);
      }
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order.orderId,
        status: order.status,
        paymentStatus: order.paymentDetails.status,
        total: order.pricing.total
      }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

// @desc    Handle payment failure
// @route   POST /api/payments/failed
// @access  Private
export const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, error } = req.body;

    const order = await Order.findOne({ 
      orderId, 
      userId: req.user._id 
    });

    if (order) {
      order.paymentDetails.status = 'failed';
      order.status = 'cancelled';
      order.cancelReason = error?.description || 'Payment failed';
      order.cancelledAt = new Date();
      await order.save();
    }

    res.json({
      success: true,
      message: 'Payment failure recorded'
    });

  } catch (error) {
    console.error('Handle payment failure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment failure'
    });
  }
};

// @desc    Get Razorpay key (public)
// @route   GET /api/payments/key
// @access  Private
export const getRazorpayKey = async (req, res) => {
  res.json({
    success: true,
    data: {
      key: process.env.RAZORPAY_KEY_ID
    }
  });
};

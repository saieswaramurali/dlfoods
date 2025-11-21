import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

class OrderService {
  // Generate unique order ID
  generateOrderId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DLF${timestamp.slice(-6)}${random}`;
  }

  // Calculate pricing with taxes and shipping
  calculatePricing(items, shippingAddress) {
    let subtotal = 0;
    
    // Calculate subtotal
    items.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    // Shipping calculation
    let shipping = 0;
    if (subtotal < 500) {
      shipping = 50; // ₹50 shipping for orders below ₹500
    }

    // Tax calculation (5% GST)
    const tax = Math.round((subtotal * 0.05) * 100) / 100;

    // Total
    const total = subtotal + shipping + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      discount: 0, // Will be calculated when coupons are applied
      total: Math.round(total * 100) / 100
    };
  }

  // Create order atomically with transaction
  async createOrder(userId, orderData) {
    const session = await mongoose.startSession();
    
    try {
      await session.startTransaction();

      // 1. Validate user exists
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // 2. Get user's cart
      const cart = await Cart.findOne({ userId }).populate('items.productId').session(session);
      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      // 3. Validate all products exist and have sufficient stock
      const orderItems = [];
      for (const cartItem of cart.items) {
        const product = await Product.findById(cartItem.productId._id).session(session);
        
        if (!product) {
          throw new Error(`Product ${cartItem.productId.name} not found`);
        }

        if (product.stock < cartItem.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`);
        }

        // Prepare order item
        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: cartItem.quantity,
          image: product.primaryImage || (product.images && product.images[0] ? product.images[0].url : '')
        });

        // Update product stock
        await Product.findByIdAndUpdate(
          product._id,
          { $inc: { stock: -cartItem.quantity } },
          { session }
        );
      }

      // 4. Calculate pricing
      const pricing = this.calculatePricing(orderItems, orderData.shippingAddress);

      // 5. Create order
      const newOrder = new Order({
        orderId: this.generateOrderId(),
        userId,
        items: orderItems,
        pricing,
        status: 'pending', // Will be confirmed after successful payment
        shippingAddress: orderData.shippingAddress,
        paymentDetails: {
          method: 'razorpay',
          status: 'pending' // Will be updated after payment verification
        },
        couponCode: orderData.couponCode || null,
        notes: orderData.notes || ''
      });

      const savedOrder = await newOrder.save({ session });

      // 6. Clear user's cart
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { session }
      );

      await session.commitTransaction();

      // Return populated order
      const populatedOrder = await Order.findById(savedOrder._id)
        .populate('userId', 'name email')
        .populate('items.productId', 'name slug');

      return populatedOrder;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get user orders with pagination
  async getUserOrders(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ userId })
      .populate('items.productId', 'name slug images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ userId });

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  // Get single order with full details
  async getOrderById(orderId, userId = null) {
    const query = { orderId };
    if (userId) {
      query.userId = userId; // Ensure user can only access their own orders
    }

    const order = await Order.findOne(query)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name slug images description');

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  // Update order status
  async updateOrderStatus(orderId, status, adminNotes = null) {
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['shipped', 'cancelled'],
      'shipped': ['delivered', 'cancelled'],
      'delivered': ['refunded'],
      'cancelled': [],
      'refunded': []
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new Error(`Cannot change status from ${order.status} to ${status}`);
    }

    // Update order
    order.status = status;
    if (adminNotes) {
      order.adminNotes = adminNotes;
    }

    // Add tracking update
    order.tracking.updates.push({
      status,
      message: this.getStatusMessage(status),
      timestamp: new Date()
    });

      // If delivered and payment is completed, update delivery status
      if (status === 'delivered' && order.paymentDetails.status === 'completed') {
        // Order delivered and payment already completed
        order.deliveredAt = new Date();
      }    await order.save();
    return order;
  }

  // Cancel order and restore stock
  async cancelOrder(orderId, userId, reason) {
    const session = await mongoose.startSession();
    
    try {
      await session.startTransaction();

      const order = await Order.findOne({ orderId, userId }).session(session);
      
      if (!order) {
        throw new Error('Order not found');
      }

      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new Error('Order cannot be cancelled at this stage');
      }

      // Restore stock for all items
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }

      // Update order status
      order.status = 'cancelled';
      order.cancelReason = reason;
      order.tracking.updates.push({
        status: 'cancelled',
        message: `Order cancelled by customer. Reason: ${reason}`,
        timestamp: new Date()
      });

      await order.save({ session });
      await session.commitTransaction();

      return order;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Helper method for status messages
  getStatusMessage(status) {
    const messages = {
      'pending': 'Order placed successfully',
      'confirmed': 'Order confirmed and being processed',
      'preparing': 'Order is being prepared for shipment',
      'shipped': 'Order has been shipped',
      'delivered': 'Order delivered successfully',
      'cancelled': 'Order has been cancelled',
      'refunded': 'Order has been refunded'
    };
    return messages[status] || 'Order status updated';
  }

  // Prepare order for Razorpay integration (for future use)
  async createRazorpayOrder(orderId) {
    const order = await this.getOrderById(orderId);
    
    // This will be implemented when we add Razorpay
    const razorpayOrderData = {
      amount: Math.round(order.pricing.total * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId: order.orderId,
        userId: order.userId.toString()
      }
    };

    return razorpayOrderData;
  }
}

export default new OrderService();
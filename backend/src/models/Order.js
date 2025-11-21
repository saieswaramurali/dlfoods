import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: true
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  paymentDetails: {
    method: {
      type: String,
      required: true,
      enum: ['razorpay', 'cod', 'upi', 'card'],
      default: 'cod'
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date
  },
  tracking: {
    trackingId: String,
    courier: String,
    estimatedDelivery: Date,
    updates: [{
      status: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      location: String
    }]
  },
  couponCode: String,
  notes: String,
  adminNotes: String,
  cancelReason: String,
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  deliveredAt: Date,
  cancelledAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'paymentDetails.status': 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order weight (if needed for shipping)
orderSchema.virtual('totalWeight').get(function() {
  return this.items.reduce((total, item) => {
    // Assuming each item has a weight - you can populate this from Product
    return total + (item.weight || 0) * item.quantity;
  }, 0);
});

// Virtual to check if order is cancellable
orderSchema.virtual('isCancellable').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual to check if order is returnable
orderSchema.virtual('isReturnable').get(function() {
  if (this.status !== 'delivered') return false;
  
  const deliveryDate = this.deliveredAt || this.updatedAt;
  const returnDeadline = new Date(deliveryDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
  return new Date() <= returnDeadline;
});

// Method to add tracking update
orderSchema.methods.addTrackingUpdate = function(status, message, location = '') {
  this.tracking.updates.push({
    status,
    message,
    location,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, message = '') {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add tracking update
  if (message) {
    this.addTrackingUpdate(newStatus, message);
  }
  
  // Set specific timestamps
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  } else if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }
  
  return this.save();
};

// Method to calculate refund amount
orderSchema.methods.calculateRefund = function() {
  let refundAmount = this.pricing.total;
  
  // Deduct shipping if already shipped
  if (['shipped', 'delivered'].includes(this.status)) {
    refundAmount -= this.pricing.shipping;
  }
  
  return refundAmount;
};

// Pre-save middleware to generate order ID
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `DLF${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate total
orderSchema.pre('save', function(next) {
  if (this.isModified('pricing.subtotal') || this.isModified('pricing.shipping') || 
      this.isModified('pricing.tax') || this.isModified('pricing.discount')) {
    this.pricing.total = this.pricing.subtotal + this.pricing.shipping + 
                        this.pricing.tax - this.pricing.discount;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
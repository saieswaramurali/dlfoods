import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
cartSchema.index({ userId: 1 });

// Virtual for total items in cart
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1) {
  const existingItem = this.items.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ productId, quantity });
  }
  
  this.updatedAt = new Date();
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(item => 
        item.productId.toString() !== productId.toString()
      );
    } else {
      item.quantity = quantity;
    }
    this.updatedAt = new Date();
    return this.save();
  }
  
  throw new Error('Item not found in cart');
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  this.updatedAt = new Date();
  return this.save();
};

// Method to clear cart
cartSchema.methods.clear = function() {
  this.items = [];
  this.updatedAt = new Date();
  return this.save();
};

export default mongoose.model('Cart', cartSchema);
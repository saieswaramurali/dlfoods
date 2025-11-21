import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: [100, 'Review title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxLength: [1000, 'Review comment cannot exceed 1000 characters']
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  adminNotes: String
}, {
  timestamps: true
});

// Compound index to ensure one review per user per product per order
reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

// Index for faster queries
reviewSchema.index({ productId: 1, isApproved: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: -1 });

// Method to mark review as helpful
reviewSchema.methods.markHelpful = function() {
  this.helpfulCount += 1;
  return this.save();
};

export default mongoose.model('Review', reviewSchema);
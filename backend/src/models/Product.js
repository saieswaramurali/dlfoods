import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  fullDescription: {
    type: String,
    maxLength: [2000, 'Full description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  category: {
    type: String,
    required: true,
    enum: ['masala', 'supplement', 'powder', 'blend'],
    lowercase: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionFacts: {
    servingSize: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sodium: Number,
    sugar: Number
  },
  inventory: {
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  seo: {
    metaTitle: {
      type: String,
      maxLength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxLength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      lowercase: true,
      trim: true
    }]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg', 'ml', 'l'],
      default: 'g'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch'],
      default: 'cm'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ price: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.inventory.stock === 0) return 'out-of-stock';
  if (this.inventory.stock <= this.inventory.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  if (!this.images || !Array.isArray(this.images) || this.images.length === 0) {
    return '';
  }
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : '');
});

// Method to update ratings
productSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.ratings.average * this.ratings.count) + newRating;
  this.ratings.count += 1;
  this.ratings.average = totalRating / this.ratings.count;
  return this.save();
};

// Method to reduce stock
productSchema.methods.reduceStock = function(quantity) {
  if (this.inventory.stock >= quantity) {
    this.inventory.stock -= quantity;
    if (this.inventory.stock === 0) {
      this.inventory.isAvailable = false;
    }
    return this.save();
  }
  throw new Error('Insufficient stock');
};

// Method to increase stock
productSchema.methods.increaseStock = function(quantity) {
  this.inventory.stock += quantity;
  if (this.inventory.stock > 0) {
    this.inventory.isAvailable = true;
  }
  return this.save();
};

// Pre-save middleware to set slug from name if not provided
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

export default mongoose.model('Product', productSchema);
import express from 'express';
import mongoose from 'mongoose';
import { optionalAuth } from '../middleware/auth.js';
import { validate, schemas, validatePagination } from '../middleware/validation.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', validatePagination, optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', search, category, minPrice, maxPrice } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')
      .lean();

    const total = await Product.countDocuments(query);

    // Add computed fields
    const productsWithVirtuals = products.map(product => ({
      ...product,
      discountPercentage: product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0,
      stockStatus: product.inventory.stock === 0 ? 'out-of-stock' 
        : product.inventory.stock <= product.inventory.lowStockThreshold ? 'low-stock' 
        : 'in-stock',
      primaryImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || ''
    }));

    res.json({
      success: true,
      data: {
        products: productsWithVirtuals,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ sortOrder: 1, createdAt: -1 })
    .limit(4)
    .select('-__v')
    .lean();

    const productsWithVirtuals = products.map(product => ({
      ...product,
      discountPercentage: product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0,
      stockStatus: product.inventory.stock === 0 ? 'out-of-stock' 
        : product.inventory.stock <= product.inventory.lowStockThreshold ? 'low-stock' 
        : 'in-stock',
      primaryImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || ''
    }));

    res.json({
      success: true,
      data: { products: productsWithVirtuals }
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get product categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: { products: [] }
      });
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .limit(Number(limit))
    .select('name slug price images')
    .lean();

    const productsWithImage = products.map(product => ({
      ...product,
      primaryImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || ''
    }));

    res.json({
      success: true,
      data: { products: productsWithImage }
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/:slug
// @desc    Get product by slug
// @access  Public
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    }).select('-__v').lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get product reviews
    const reviews = await Review.find({ 
      productId: product._id,
      isApproved: true 
    })
    .populate('userId', 'name profileImage')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    // Add computed fields
    const productWithVirtuals = {
      ...product,
      discountPercentage: product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0,
      stockStatus: product.inventory.stock === 0 ? 'out-of-stock' 
        : product.inventory.stock <= product.inventory.lowStockThreshold ? 'low-stock' 
        : 'in-stock',
      primaryImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || ''
    };

    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
    .limit(4)
    .select('name slug price images')
    .lean();

    const relatedWithImage = relatedProducts.map(p => ({
      ...p,
      primaryImage: p.images.find(img => img.isPrimary)?.url || p.images[0]?.url || ''
    }));

    res.json({
      success: true,
      data: {
        product: productWithVirtuals,
        reviews,
        relatedProducts: relatedWithImage
      }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/:productId/reviews
// @desc    Get product reviews
// @access  Public
router.get('/:productId/reviews', validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const reviews = await Review.find({ 
      productId: req.params.productId,
      isApproved: true 
    })
    .populate('userId', 'name profileImage')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

    const total = await Review.countDocuments({ 
      productId: req.params.productId,
      isApproved: true 
    });

    // Get review statistics
    const stats = await Review.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(req.params.productId), isApproved: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        stats,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
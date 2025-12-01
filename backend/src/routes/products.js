import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { validate, schemas, validatePagination } from '../middleware/validation.js';
import {
  getAllProducts,
  getFeaturedProducts,
  getProductCategories,
  searchProducts,
  getProductBySlug,
  getProductReviews
} from '../controllers/productController.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', validatePagination, optionalAuth, getAllProducts);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/categories
// @desc    Get product categories with counts
// @access  Public
router.get('/categories', getProductCategories);

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', searchProducts);

// @route   GET /api/products/:slug
// @desc    Get product by slug
// @access  Public
router.get('/:slug', optionalAuth, getProductBySlug);

// @route   GET /api/products/:productId/reviews
// @desc    Get product reviews
// @access  Public
router.get('/:productId/reviews', validatePagination, getProductReviews);

export default router;
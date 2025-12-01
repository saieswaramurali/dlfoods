import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import {
  getUserCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// Apply authentication to all cart routes
router.use(authenticateToken);

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', getUserCart);

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post('/items', validate(schemas.cartItem), addItemToCart);

// @route   PUT /api/cart/items/:productId
// @desc    Update item quantity in cart
// @access  Private
router.put('/items/:productId', updateCartItem);

// @route   DELETE /api/cart/items/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:productId', removeCartItem);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', clearCart);

export default router;
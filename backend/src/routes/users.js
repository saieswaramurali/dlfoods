import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserOrders,
  getUserOrder
} from '../controllers/userController.js';

const router = express.Router();

// Apply authentication to all user routes
router.use(authenticateToken);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', validate(schemas.updateProfile), updateUserProfile);

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', getUserAddresses);

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', validate(schemas.address), addUserAddress);

// @route   PUT /api/users/addresses/:addressId
// @desc    Update address
// @access  Private
router.put('/addresses/:addressId', validate(schemas.address), updateUserAddress);

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete('/addresses/:addressId', deleteUserAddress);

// @route   GET /api/users/orders
// @desc    Get user orders
// @access  Private
router.get('/orders', getUserOrders);

// @route   GET /api/users/orders/:orderId
// @desc    Get specific order
// @access  Private
router.get('/orders/:orderId', getUserOrder);

export default router;
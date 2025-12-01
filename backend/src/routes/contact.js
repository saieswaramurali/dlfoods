import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import {
  sendContactMessage,
  getAllContactMessages,
  getContactById,
  updateContactStatus,
  getContactStats
} from '../controllers/contactController.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Send contact form message
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 5 and 400 words (10-2000 characters)'),
  body('subject')
    .optional()
    .trim()
    .isIn(['', 'general', 'product', 'order', 'shipping', 'return', 'wholesale', 'feedback', 'other'])
    .withMessage('Please select a valid subject category')
], (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
}, sendContactMessage);

// @route   GET /api/contact/admin
// @desc    Get all contact messages (Admin only)
// @access  Private (Admin)
router.get('/admin', authenticateToken, getAllContactMessages);

// @route   GET /api/contact/admin/:id
// @desc    Get single contact message (Admin only)
// @access  Private (Admin)
router.get('/admin/:id', authenticateToken, getContactById);

// @route   PUT /api/contact/admin/:id/status
// @desc    Update contact message status (Admin only)
// @access  Private (Admin)
router.put('/admin/:id/status', authenticateToken, [
  body('status')
    .isIn(['new', 'read', 'responded', 'resolved'])
    .withMessage('Invalid status'),
  body('adminNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
}, updateContactStatus);

// @route   GET /api/contact/admin/stats
// @desc    Get contact statistics (Admin only)
// @access  Private (Admin)
router.get('/admin/stats', authenticateToken, getContactStats);

export default router;
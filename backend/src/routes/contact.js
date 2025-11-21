import express from 'express';
import { body, validationResult } from 'express-validator';
import emailService from '../services/emailService.js';
import Contact from '../models/Contact.js';
import { authenticateToken } from '../middleware/auth.js';

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
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Get client info for tracking
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.get('User-Agent');

    // Save contact message to database
    const contactMessage = new Contact({
      name,
      email,
      subject: subject || 'general',
      message,
      ipAddress,
      userAgent,
      status: 'new',
      priority: 'medium'
    });

    const savedContact = await contactMessage.save();

    // Send contact email using email service
    await emailService.sendContactEmail({
      name,
      email,
      subject: subject || 'Contact Form Inquiry',
      message,
      contactId: savedContact._id
    });

    res.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: {
        contactId: savedContact._id,
        referenceNumber: `DLF-${savedContact._id.toString().slice(-8).toUpperCase()}`
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// @route   GET /api/contact/admin
// @desc    Get all contact messages (Admin only)
// @access  Private (Admin)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, search } = req.query;
    
    // Build query
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('respondedBy', 'name email');

    const total = await Contact.countDocuments(query);
    const stats = await Contact.getStats();

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalContacts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
});

// @route   GET /api/contact/admin/:id
// @desc    Get single contact message (Admin only)
// @access  Private (Admin)
router.get('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      await contact.markAsRead();
    }

    res.json({
      success: true,
      data: { contact }
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message'
    });
  }
});

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
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, adminNotes, priority } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Update fields
    contact.status = status;
    if (adminNotes !== undefined) {
      contact.adminNotes = adminNotes;
    }
    if (priority) {
      contact.priority = priority;
    }
    
    // Set responded info if marking as responded
    if (status === 'responded' && contact.status !== 'responded') {
      contact.respondedAt = new Date();
      contact.respondedBy = req.user._id;
    }

    await contact.save();

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: { contact }
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
});

// @route   GET /api/contact/admin/stats
// @desc    Get contact statistics (Admin only)
// @access  Private (Admin)
router.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await Contact.getStats();
    const recent = await Contact.getRecent(5);

    res.json({
      success: true,
      data: {
        stats,
        recent
      }
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
});

export default router;
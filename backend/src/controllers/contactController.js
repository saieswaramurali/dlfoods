import emailService from '../services/emailService.js';
import Contact from '../models/Contact.js';

// @desc    Send contact form message
// @access  Public
export const sendContactMessage = async (req, res) => {
  try {
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

    // Send contact email using email service (non-blocking)
    setImmediate(async () => {
      try {
        await emailService.sendContactEmail({
          name,
          email,
          subject: subject || 'Contact Form Inquiry',
          message,
          contactId: savedContact._id
        });
      } catch (emailError) {
        console.log('Failed to send contact email:', emailError.message);
      }
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
};

// @desc    Get all contact messages (Admin only)
// @access  Private (Admin)
export const getAllContactMessages = async (req, res) => {
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
};

// @desc    Get single contact message (Admin only)
// @access  Private (Admin)
export const getContactById = async (req, res) => {
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
};

// @desc    Update contact message status (Admin only)
// @access  Private (Admin)
export const updateContactStatus = async (req, res) => {
  try {
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
};

// @desc    Get contact statistics (Admin only)
// @access  Private (Admin)
export const getContactStats = async (req, res) => {
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
};
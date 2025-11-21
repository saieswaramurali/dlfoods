import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

// Apply authentication to all user routes
router.use(authenticateToken);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      joinedDate: user.joinedDate,
      addresses: user.addresses,
      preferences: user.preferences
    };

    res.json({
      success: true,
      data: { user: userData }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', validate(schemas.updateProfile), async (req, res) => {
  try {
    const { name, phone, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      joinedDate: user.joinedDate,
      addresses: user.addresses,
      preferences: user.preferences
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: userData }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    
    res.json({
      success: true,
      data: { addresses: user.addresses }
    });

  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', validate(schemas.address), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await user.addAddress(req.body);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: { addresses: user.addresses }
    });

  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/addresses/:addressId
// @desc    Update address
// @access  Private
router.put('/addresses/:addressId', validate(schemas.address), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default, remove default from others
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Update address fields
    Object.assign(address, req.body);
    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: { addresses: user.addresses }
    });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Don't allow deleting the only address
    if (user.addresses.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the only address'
      });
    }

    const wasDefault = address.isDefault;
    address.deleteOne();

    // If deleted address was default, make first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: { addresses: user.addresses }
    });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/orders
// @desc    Get user orders
// @access  Private
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { userId: req.user._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.productId', 'name images slug');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/orders/:orderId
// @desc    Get specific order
// @access  Private
router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      userId: req.user._id
    }).populate('items.productId', 'name images slug');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
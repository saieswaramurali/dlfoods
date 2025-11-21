import express from 'express';
import passport from 'passport';
import { generateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiting.js';

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = generateToken(req.user._id);
      
      // Prepare user data
      const userData = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
        profileImage: req.user.profileImage,
        authProvider: req.user.authProvider,
        joinedDate: req.user.joinedDate
      };

      // Redirect to frontend with token and user data
      const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
      const redirectURL = `${clientURL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      
      res.redirect(redirectURL);
    } catch (error) {
      console.error('Auth callback error:', error);
      const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientURL}/auth/error?message=Authentication failed`);
    }
  }
);

// @route   POST /api/auth/verify
// @desc    Verify JWT token and get user data
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
    
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.userId).select('-__v');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      joinedDate: user.joinedDate
    };

    res.json({
      success: true,
      message: 'Token verified successfully',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during token verification'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
    
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.userId).select('-__v');

    if (!user || !user.isActive) {
      return res.status(401).json({
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
      addresses: user.addresses
    };

    res.json({
      success: true,
      data: { user: userData }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
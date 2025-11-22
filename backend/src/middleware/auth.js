import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Verify JWT Token Middleware
const authenticateToken = async (req, res, next) => {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-__v');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
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

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-__v');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Admin role check (you can extend this later)
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // For now, you can add admin check based on email or a role field
  // Example: if (!req.user.isAdmin) { ... }
  
  next();
};

// Admin Secret Key Authentication Middleware
const authenticateAdminSecret = (req, res, next) => {
  try {
    const adminSecret = req.headers['x-admin-secret'];
    
    // Debug logging
    console.log('Admin auth debug:');
    console.log('- Received secret:', adminSecret ? `${adminSecret.substring(0, 20)}...` : 'none');
    console.log('- Received length:', adminSecret?.length);
    console.log('- Expected secret:', process.env.ADMIN_SECRET_KEY ? `${process.env.ADMIN_SECRET_KEY.substring(0, 20)}...` : 'none');
    console.log('- Expected length:', process.env.ADMIN_SECRET_KEY?.length);
    console.log('- Secrets match:', adminSecret === process.env.ADMIN_SECRET_KEY);
    
    // Character-by-character comparison for debugging
    if (adminSecret && process.env.ADMIN_SECRET_KEY && adminSecret !== process.env.ADMIN_SECRET_KEY) {
      console.log('- Character comparison:');
      const minLength = Math.min(adminSecret.length, process.env.ADMIN_SECRET_KEY.length);
      for (let i = 0; i < minLength; i++) {
        if (adminSecret[i] !== process.env.ADMIN_SECRET_KEY[i]) {
          console.log(`  Diff at position ${i}: received '${adminSecret[i]}' (${adminSecret.charCodeAt(i)}) vs expected '${process.env.ADMIN_SECRET_KEY[i]}' (${process.env.ADMIN_SECRET_KEY.charCodeAt(i)})`);
          break;
        }
      }
    }
    
    if (!adminSecret) {
      return res.status(401).json({
        success: false,
        message: 'Admin secret key required'
      });
    }

    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin secret key'
      });
    }

    // Add admin info to request object
    req.admin = {
      id: 'admin',
      role: 'admin',
      authenticated: true
    };

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin authentication'
    });
  }
};

export {
  generateToken,
  authenticateToken,
  optionalAuth,
  requireAdmin,
  authenticateAdminSecret
};
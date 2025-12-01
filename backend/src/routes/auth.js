import express from 'express';
import passport from 'passport';
import { authLimiter } from '../middleware/rateLimiting.js';
import {
  initiateGoogleAuth,
  googleAuthCallback,
  verifyToken,
  logout,
  getCurrentUser
} from '../controllers/authController.js';

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', initiateGoogleAuth);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  googleAuthCallback
);

// @route   POST /api/auth/verify
// @desc    Verify JWT token and get user data
// @access  Public
router.post('/verify', verifyToken);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post('/logout', logout);

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', getCurrentUser);

export default router;
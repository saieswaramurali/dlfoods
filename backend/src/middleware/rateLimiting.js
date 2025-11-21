import rateLimit from 'express-rate-limit';

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Auth routes rate limiting (more strict)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Order creation rate limiting
const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 order creations per minute
  message: {
    success: false,
    message: 'Too many order attempts, please wait before trying again.'
  },
});

// Review submission rate limiting
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 reviews per hour
  message: {
    success: false,
    message: 'Too many review submissions, please try again later.'
  },
});

export {
  generalLimiter,
  authLimiter,
  orderLimiter,
  reviewLimiter
};
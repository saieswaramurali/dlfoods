import Joi from 'joi';

// Validation schemas
const schemas = {
  // User validation
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    phone: Joi.string().pattern(/^[+]?[\d\s-()]{10,15}$/).optional().allow(''),
    preferences: Joi.object({
      notifications: Joi.boolean(),
      newsletter: Joi.boolean()
    }).optional()
  }),

  // Address validation
  address: Joi.object({
    fullName: Joi.string().min(2).max(100).required().trim(),
    address: Joi.string().min(10).max(200).required().trim(),
    city: Joi.string().min(2).max(50).required().trim(),
    state: Joi.string().min(2).max(50).required().trim(),
    pincode: Joi.string().pattern(/^\d{6}$/).required(),
    phone: Joi.string().pattern(/^[+]?[\d\s-()]{10,15}$/).required(),
    isDefault: Joi.boolean().optional()
  }),

  // Product validation
  product: Joi.object({
    name: Joi.string().min(2).max(100).required().trim(),
    description: Joi.string().min(10).max(500).required().trim(),
    fullDescription: Joi.string().max(2000).optional().trim(),
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0).optional(),
    category: Joi.string().valid('masala', 'supplement', 'powder', 'blend').required(),
    tags: Joi.array().items(Joi.string().trim()),
    benefits: Joi.array().items(Joi.string().trim()),
    ingredients: Joi.array().items(Joi.string().trim()),
    inventory: Joi.object({
      stock: Joi.number().min(0).required(),
      lowStockThreshold: Joi.number().min(0).optional(),
      isAvailable: Joi.boolean().optional()
    }).optional()
  }),

  // Order validation
  createOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().min(1).required()
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      fullName: Joi.string().min(2).max(100).required().trim(),
      address: Joi.string().min(10).max(200).required().trim(),
      city: Joi.string().min(2).max(50).required().trim(),
      state: Joi.string().min(2).max(50).required().trim(),
      pincode: Joi.string().pattern(/^\d{6}$/).required(),
      phone: Joi.string().pattern(/^[+]?[\d\s-()]{10,15}$/).required()
    }).required(),
    paymentMethod: Joi.string().valid('razorpay', 'cod', 'upi', 'card').default('cod'),
    notes: Joi.string().max(500).optional().trim(),
    couponCode: Joi.string().optional().trim()
  }),

  // Cart validation
  cartItem: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().min(1).max(10).required()
  }),

  // Review validation
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    title: Joi.string().min(5).max(100).required().trim(),
    comment: Joi.string().min(10).max(1000).required().trim()
  }),

  // Query parameters validation
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', '-createdAt', 'price', '-price', 'name', '-name').default('-createdAt'),
    search: Joi.string().max(100).optional().trim()
  }),

  // MongoDB ObjectId validation
  mongoId: Joi.string().hex().length(24).required()
};

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown fields
      allowUnknown: false // Don't allow unknown fields
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages
      });
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Common validation middleware
const validateObjectId = validate(schemas.mongoId, 'params');
const validatePagination = validate(schemas.pagination, 'query');

export {
  schemas,
  validate,
  validateObjectId,
  validatePagination
};
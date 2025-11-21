import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Apply authentication to all cart routes
router.use(authenticateToken);

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId', 'name price images inventory slug')
      .lean();

    if (!cart) {
      cart = { items: [], totalItems: 0 };
    } else {
      // Calculate totals and filter out unavailable products
      cart.items = cart.items.filter(item => 
        item.productId && item.productId.inventory.isAvailable
      );

      cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
      
      cart.subtotal = cart.items.reduce((total, item) => {
        return total + (item.productId.price * item.quantity);
      }, 0);

      // Add primary image to each item
      cart.items = cart.items.map(item => ({
        ...item,
        productId: {
          ...item.productId,
          primaryImage: item.productId.images.find(img => img.isPrimary)?.url || 
                       item.productId.images[0]?.url || ''
        }
      }));
    }

    res.json({
      success: true,
      data: { cart }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post('/items', validate(schemas.cartItem), async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists and is available
    const product = await Product.findById(productId);
    if (!product || !product.inventory.isAvailable) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Check stock
    if (product.inventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Add item to cart
    await cart.addItem(productId, quantity);

    // Populate and return updated cart
    await cart.populate('items.productId', 'name price images inventory slug');

    res.json({
      success: true,
      message: 'Item added to cart',
      data: { cart }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/cart/items/:productId
// @desc    Update item quantity in cart
// @access  Private
router.put('/items/:productId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    // Check product stock if increasing quantity
    if (quantity > 0) {
      const product = await Product.findById(productId);
      if (!product || product.inventory.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.updateItemQuantity(productId, quantity);
    await cart.populate('items.productId', 'name price images inventory slug');

    res.json({
      success: true,
      message: 'Cart updated',
      data: { cart }
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/cart/items/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeItem(req.params.productId);
    await cart.populate('items.productId', 'name price images inventory slug');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: { cart }
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      await cart.clear();
    }

    res.json({
      success: true,
      message: 'Cart cleared',
      data: { cart: { items: [], totalItems: 0 } }
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
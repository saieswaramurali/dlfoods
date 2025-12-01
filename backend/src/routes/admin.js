import express from 'express';
import { authenticateAdminSecret } from '../middleware/auth.js';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllContacts,
  updateContactStatus,
  getAllUsers
} from '../controllers/adminController.js';

const router = express.Router();

// Apply admin authentication to all admin routes
router.use(authenticateAdminSecret);

// Admin Dashboard Stats
router.get('/dashboard/stats', getDashboardStats);

// Get All Orders with pagination
router.get('/orders', getAllOrders);

// Update Order Status
router.put('/orders/:orderId/status', updateOrderStatus);

// Get All Contacts with pagination
router.get('/contacts', getAllContacts);

// Update Contact Status
router.put('/contacts/:contactId/status', updateContactStatus);

// Get All Users with pagination
router.get('/users', getAllUsers);

export default router;
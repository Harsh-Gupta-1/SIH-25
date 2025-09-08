import express from 'express';
import { getDashboardData, getUserStats } from '../controllers/dashboardController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes - require authentication
router.get('/data', authenticateToken, getDashboardData);

// Admin only routes
router.get('/stats', authenticateToken, authorizeRoles('admin'), getUserStats);

export default router;

import { Router } from 'express';
import {
  getDashboardStats,
  getShipmentStatusDistribution,
  getRecentActivity
} from '../controllers/dashboardController';

const router = Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/shipment-distribution - Get shipment status distribution for charts
router.get('/shipment-distribution', getShipmentStatusDistribution);

// GET /api/dashboard/recent-activity - Get recent activity data
router.get('/recent-activity', getRecentActivity);

export default router;
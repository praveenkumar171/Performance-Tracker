import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getHeatmapData,
  getHabits,
  updateHabitTracking,
  getWeeklyStats,
} from '../controllers/heatmapController';

const router = express.Router();

// Get heatmap data for 365 days
router.get('/heatmap', authMiddleware, getHeatmapData);

// Get user habits
router.get('/habits', authMiddleware, getHabits);

// Update habit tracking for a specific day
router.post('/habits', authMiddleware, updateHabitTracking);

// Get weekly stats and trend data
router.get('/stats', authMiddleware, getWeeklyStats);

export default router;

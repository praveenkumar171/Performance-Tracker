import { Router } from 'express';
import { getDailyEntries, getTodayEntry, createDailyEntry, getStats } from '../controllers/dailyController';
import { authMiddleware } from '../middleware/auth';

const dailyRouter = Router();

// All routes require authentication
dailyRouter.use(authMiddleware);

// Get all entries for user
dailyRouter.get('/entries', getDailyEntries);

// Get today's entry
dailyRouter.get('/today', getTodayEntry);

// Create/update daily entry
dailyRouter.post('/entries', createDailyEntry);

// Get stats
dailyRouter.get('/stats', getStats);

export default dailyRouter;

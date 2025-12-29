import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/schema';
import authRouter from './routes/authRoutes';
import dailyRouter from './routes/dailyRoutes';
import heatmapRouter from './routes/heatmapRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database (optional - skip if DB not configured)
initDatabase().catch((err) => {
  console.warn('⚠️  Database not connected. Running in test mode.');
  console.warn('This is OK for testing API workflow.');
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/daily', dailyRouter);
app.use('/api/heatmap', heatmapRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running ✅' });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


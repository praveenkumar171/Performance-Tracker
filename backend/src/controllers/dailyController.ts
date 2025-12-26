import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

interface DailyEntry {
  id: number;
  user_id: number;
  entry_date: string;
  skill_points: number;
  career_points: number;
  project_points: number;
  total_score: number;
  notes: string;
  created_at: string;
}

// In-memory storage for testing
const dailyEntries: DailyEntry[] = [];

// Get today's entry or all entries for a user
export const getDailyEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;
    const userEntries = dailyEntries.filter((e) => e.user_id === userId);

    res.json({
      message: 'Daily entries retrieved (TEST MODE)',
      entries: userEntries.sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()),
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get today's entry
export const getTodayEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;
    const today = new Date().toISOString().split('T')[0];

    const entry = dailyEntries.find((e) => e.user_id === userId && e.entry_date === today);

    if (!entry) {
      return res.json({
        message: 'No entry for today',
        entry: null,
      });
    }

    res.json({
      message: 'Today entry retrieved (TEST MODE)',
      entry,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create or update daily entry
export const createDailyEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;
    const { skillPoints, careerPoints, projectPoints, notes } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Validate input
    if (skillPoints === undefined || careerPoints === undefined || projectPoints === undefined) {
      return res.status(400).json({ message: 'skillPoints, careerPoints, and projectPoints are required' });
    }

    // Cap each at 3 points (total max 10)
    const skill = Math.min(Math.max(skillPoints, 0), 3);
    const career = Math.min(Math.max(careerPoints, 0), 3);
    const project = Math.min(Math.max(projectPoints, 0), 3);
    const totalScore = Math.min(skill + career + project, 10);

    // Check if entry exists for today
    const existingIndex = dailyEntries.findIndex((e) => e.user_id === userId && e.entry_date === today);

    if (existingIndex !== -1) {
      // Update existing
      dailyEntries[existingIndex] = {
        ...dailyEntries[existingIndex],
        skill_points: skill,
        career_points: career,
        project_points: project,
        total_score: totalScore,
        notes: notes || '',
      };

      return res.json({
        message: 'Daily entry updated (TEST MODE)',
        entry: dailyEntries[existingIndex],
      });
    }

    // Create new
    const newEntry: DailyEntry = {
      id: dailyEntries.length + 1,
      user_id: userId,
      entry_date: today,
      skill_points: skill,
      career_points: career,
      project_points: project,
      total_score: totalScore,
      notes: notes || '',
      created_at: new Date().toISOString(),
    };

    dailyEntries.push(newEntry);

    res.status(201).json({
      message: 'Daily entry created (TEST MODE)',
      entry: newEntry,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get stats (streak, total score, etc)
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;
    const userEntries = dailyEntries
      .filter((e) => e.user_id === userId)
      .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());

    const totalEntries = userEntries.length;
    const totalScore = userEntries.reduce((sum, e) => sum + e.total_score, 0);
    const averageScore = totalEntries > 0 ? (totalScore / totalEntries).toFixed(1) : 0;

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(new Date().getTime() - 86400000).toISOString().split('T')[0];
    const hasEntryToday = userEntries.some((e) => e.entry_date === today);
    const hasEntryYesterday = userEntries.some((e) => e.entry_date === yesterday);

    if (hasEntryToday || hasEntryYesterday) {
      currentStreak = 1;
    }

    // Calculate longest streak
    for (let i = 0; i < userEntries.length; i++) {
      if (i === 0 || isConsecutiveDay(userEntries[i - 1].entry_date, userEntries[i].entry_date)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    res.json({
      message: 'Stats retrieved (TEST MODE)',
      stats: {
        totalEntries,
        totalScore,
        averageScore,
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Helper function to check if dates are consecutive
function isConsecutiveDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDiff = d1.getTime() - d2.getTime();
  return timeDiff === 86400000; // 24 hours in milliseconds
}

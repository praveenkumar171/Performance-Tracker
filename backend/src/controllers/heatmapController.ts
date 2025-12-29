import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

interface HabitTracking {
  [userId: number]: {
    habits: string[];
    dailyHabits: {
      [date: string]: boolean[];
    };
  };
}

interface DailyScores {
  [date: string]: number;
}

const habitTracking: HabitTracking = {};
const dailyScores: { [userId: number]: DailyScores } = {};

const defaultHabits = [
  'Study 2.5 hour',
  'Workout',
  'Watch 1 Movie',
  'Leet Code 1 problem',
  'Learn Skills',
  'Linux Commands',
  'Water intake',
  'Sleep 7h',
  'Programming Practice',
  'Aptitude',
];

const TOTAL_SCORE_PER_DAY = 70; // Total possible score per day

// Get heatmap data for the year
export const getHeatmapData = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;

    if (!dailyScores[userId]) {
      dailyScores[userId] = {};
    }

    const scores = dailyScores[userId];
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');

    const heatmapDays = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const score = scores[dateStr] || 0;
      heatmapDays.push({
        date: dateStr,
        score: score,
        level: score === 0 ? 0 : score <= 3 ? 1 : score <= 6 ? 2 : score <= 8 ? 3 : 4,
      });

      current.setDate(current.getDate() + 1);
    }

    res.json({
      heatmapDays,
      totalDays: heatmapDays.length,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    });
  } catch (error) {
    console.error('Heatmap error:', error);
    res.status(500).json({ message: 'Failed to get heatmap data', error: (error as any).message });
  }
};

// Get habits for user
export const getHabits = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;

    if (!habitTracking[userId]) {
      habitTracking[userId] = {
        habits: [...defaultHabits],
        dailyHabits: {},
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const week = getWeekDates(today);

    const weekHabits = week.map((date) => ({
      date,
      habits: habitTracking[userId].dailyHabits[date] || Array(habitTracking[userId].habits.length).fill(false),
    }));

    res.json({
      habits: habitTracking[userId].habits,
      weekHabits,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get habits', error });
  }
};

// Update habit tracking
export const updateHabitTracking = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;
    const { date, habits } = req.body;

    if (!habitTracking[userId]) {
      habitTracking[userId] = {
        habits: [...defaultHabits],
        dailyHabits: {},
      };
    }

    habitTracking[userId].dailyHabits[date] = habits;

    // Update daily score based on completed habits (max 70)
    const completedCount = habits.filter((h: boolean) => h).length;
    const scorePerHabit = TOTAL_SCORE_PER_DAY / habitTracking[userId].habits.length;
    const dailyScore = Math.round(completedCount * scorePerHabit);

    if (!dailyScores[userId]) {
      dailyScores[userId] = {};
    }
    dailyScores[userId][date] = dailyScore;

    res.json({
      message: 'Habit tracking updated',
      date,
      score: dailyScore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update habit tracking', error });
  }
};

// Get weekly stats
export const getWeeklyStats = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;
    const today = new Date();
    const scores = dailyScores[userId] || {};

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const weekStats = weekDays.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];
      return {
        day,
        score: scores[dateStr] || 0,
      };
    });

    // Get last 30 days for trend
    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trendData.push({
        date: dateStr.slice(5),
        score: scores[dateStr] || 0,
      });
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const completionRate = Math.round((Object.keys(scores).length / 365) * 100);

    res.json({
      weekStats,
      trendData,
      totalScore,
      completionRate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get weekly stats', error });
  }
};

function getWeekDates(dateStr: string): string[] {
  const date = new Date(dateStr);
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay() + 1);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  return weekDates;
}

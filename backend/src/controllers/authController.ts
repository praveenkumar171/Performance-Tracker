import { Response } from 'express';
import bcryptjs from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import { query } from '../db/pool';
import { generateToken } from '../utils/jwt';

interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  career_goal: string;
  joined_date: string;
}

// In-memory storage for testing (without database)
const testUsers: { [key: string]: User } = {};

// Register
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, careerGoal } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // For testing: store in memory instead of DB
    if (testUsers[email]) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = {
      id: Object.keys(testUsers).length + 1,
      name,
      email,
      password_hash: hashedPassword,
      career_goal: careerGoal || 'AI Engineer',
      joined_date: new Date().toISOString(),
    };

    testUsers[email] = user;
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      message: 'User registered successfully (TEST MODE)',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        career_goal: user.career_goal,
        joined_date: user.joined_date,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // For testing: check in-memory storage
    const user = testUsers[email];
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Login successful (TEST MODE)',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        career_goal: user.career_goal,
        joined_date: user.joined_date,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    // For testing: find user in memory
    const user = Object.values(testUsers).find((u: User) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Running in TEST MODE (no database)',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        career_goal: user.career_goal,
        joined_date: user.joined_date,
        current_streak: 0,
        longest_streak: 0,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name, careerGoal } = req.body;

    // For testing: update in memory
    const user = Object.values(testUsers).find((u: User) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (careerGoal) user.career_goal = careerGoal;

    res.json({
      message: 'Profile updated (TEST MODE - data not saved)',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        career_goal: user.career_goal,
        joined_date: user.joined_date,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

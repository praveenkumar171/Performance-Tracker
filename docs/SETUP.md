# Personal Performance & Career OS - Setup Guide

## Project Structure Overview

```
Performance Tracker/
├── backend/                 # Node.js + Express server
│   ├── src/
│   │   ├── server.ts       # Main server entry
│   │   ├── db/             # Database connection & schema
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & error handling
│   │   └── utils/          # Utilities (JWT, etc)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── pages/          # Register, Login, Profile
│   │   ├── components/     # Reusable components
│   │   ├── utils/          # API client, Auth context
│   │   ├── styles/         # Global CSS
│   │   ├── App.tsx         # Main app
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
└── docs/                    # Documentation (this file)
```

---

## Layer 1: Foundation (AUTH + IDENTITY) ✅ COMPLETE

### What We Built:
1. **Authentication System**
   - User registration with password hashing (bcryptjs)
   - Login with JWT token generation
   - Protected routes using auth middleware
   - Session persistence with localStorage

2. **Database Schema**
   - Users table (name, email, password_hash, career_goal, joined_date)
   - Prepared tables for future layers (daily_entries, skills)

3. **User Profile Page**
   - View profile (name, email, career goal, join date)
   - Edit profile (name, career goal)
   - Logout functionality
   - Streak display (prepared for Layer 3)

---

## Getting Started (Prerequisites)

### Install Required Software:
1. **Node.js** (v18+): https://nodejs.org/
2. **PostgreSQL**: https://www.postgresql.org/download/
3. **Git** (optional): https://git-scm.com/

---

## Database Setup

### Step 1: Create MySQL Database

**Windows Option 1: Using Command Line**
```bash
# Open Command Prompt and connect to MySQL
mysql -u root -p

# Enter your MySQL password (if you set one during install)

# In MySQL prompt:
CREATE DATABASE performance_tracker;
```

**Windows Option 2: Using MySQL Workbench (GUI)**
1. Open MySQL Workbench
2. Click "+" next to "MySQL Connections"
3. Create new connection
4. In Workbench, right-click "Databases" → "Create Schema"
5. Name: `performance_tracker` → Click "Apply"

**Windows Option 3: Using XAMPP (Easiest)**
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Click "Admin" to open phpMyAdmin
4. Left side: Right-click "New" → Create database
5. Name: `performance_tracker`

### Step 2: Create Database User (Optional but Recommended)

```bash
# Open MySQL
mysql -u root -p

# Create user
CREATE USER 'tracker_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON performance_tracker.* TO 'tracker_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Backend Setup

### Step 1: Navigate to backend directory

```bash
cd "c:\Users\LENOVO\Documents\Performance Tracker\backend"
```

### Step 2: Install dependencies

```bash
npm install
```

#B_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=performance_tracker
JWT_SECRET=your_super_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

**Important Notes**:
- `DB_USER`: Usually `root` (default MySQL user)
- `DB_PASSWORD`: The password you set during MySQL installation
- If you created a custom user, use that instead
- Leave `DB_PASSWORD` empty if you didn't set one during install
PORT=5000
NODE_ENV=development
```

**Important**: Replace `password` with your PostgreSQL password.

### Step 4: Start backend server

```bash
npm run dev
```

You should see:
```
✅ Database schema initialized
🚀 Server running on http://localhost:5000
```

---

## Frontend Setup

### Step 1: Navigate to frontend directory (NEW TERMINAL)

```bash
cd "c:\Users\LENOVO\Documents\Performance Tracker\frontend"
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start frontend dev server

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XX ms

➜  Local:   http://localhost:5173/
```

---

## Testing the Application

1. Open http://localhost:5173 in your browser
2. Click "Register here" to create a new account
3. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: anything secure
   - Career Goal: AI Engineer (default)
4. Click Register → You should be redirected to Profile page
5. View and edit your profile
6. Click Logout and try Login with your credentials

---

## API Endpoints (Backend Reference)

### Public Routes:
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass",
    "careerGoal": "AI Engineer"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "securepass"
  }
  ```

### Protected Routes (require JWT token):
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
  ```json
  {
    "name": "Jane Doe",
    "careerGoal": "Full Stack Developer"
  }
  ```

- `GET /api/health` - Server health check

---

## Key Concepts Explained

### JWT (JSON Web Tokens)
- After login, backend sends a token
- Frontend stores it in `localStorage`
- Token is sent with every protected request in `Authorization: Bearer <token>` header
- Server validates token before allowing access

### React Context (AuthContext)
- Global state management for user authentication
- Prevents prop drilling (passing props through many components)
- `useAuth()` hook lets any component access user & auth methods

### TypeScript
- Catch errors before runtime
- Better IDE autocomplete & documentation
- Type definitions for all functions and objects

### Express Middleware
- `authMiddleware` checks JWT token on protected routes
- Allows us to write once, reuse on many routes

---

## Common Issues & Fixes

### "Cannot find module 'pg'"
```bash
npm install
```

### PostgreSQL connection refused
- Check if MySQL is running
- Windows: Services → Find "MySQL" → Check if "Running"
- Or use XAMPP/MySQL Workbench to start MySQL
- Verify DB_HOST, DB_USER, DB_PASSWORD in .env

### Port already in use (5000 or 5173)
- Change PORT in backend/.env
- Change port in vite.config.ts frontend

### "token is invalid"
- Clear localStorage: Press F12 → Application → Storage → Clear All
- Logout and login again

---

## Next Steps: Layer 2

Once Layer 1 is working, we'll build:

**Layer 2: Daily Performance Engine**
- Daily entry form (skill work, career prep, project work)
- Score calculation (10 points/day max)
- Edit only current day's entries
- Calculate daily scores

---

## File Size Reference

- Backend: ~50KB (before node_modules)
- Frontend: ~30KB (before node_modules)
- Total node_modules: ~500MB (normal)

---

## Architecture Pattern

```
Frontend (React)
    ↓ HTTP/REST
Backend (Express)
    ↓ SQL Queries
Database (PostgreSQL)
```

Data Flow Example:
1. User clicks "Register"
2. Frontend sends POST to `/api/auth/register`
3. Backend hashes password & creates user in database
4. Backend sends back JWT token & user data
5. Frontend stores token & redirects to Profile
6. Profile page uses token to fetch user data

---

## Quick Commands Reference

**Backend:**
```bash
npm run dev        # Development server with auto-reload
npm run build      # Compile TypeScript to JavaScript
npm start          # Run compiled server
```

**Frontend:**
```bash
npm run dev        # Development server (hot reload)
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## Security Notes

- ⚠️ Never commit `.env` file (it's in .gitignore)
- Change `JWT_SECRET` in production
- Use strong passwords in PostgreSQL
- Always validate input on backend
- Hash passwords (already done with bcryptjs)

---

## What You Learned (So Far)

✅ Project structure (separation of concerns)
✅ Database design (tables, relationships)
✅ Authentication flow (register → login → protected routes)
✅ React hooks (useState, useContext, useEffect)
✅ TypeScript basics (interfaces, types)
✅ Express middleware & routing
✅ Environment variables & configuration
✅ REST API design
✅ Password hashing & security

---

Need help? Check the specific files mentioned in setup steps above.

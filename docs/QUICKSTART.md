# Quick Start Checklist ✅

## Prerequisites (5 min)
- [ ] Download & install Node.js (v18+)
- [ ] Download & install PostgreSQL
- [ ] Open 2 terminals (one for backend, one for frontend)

## Database Setup (5 min)
```bash
# Open MySQL or use XAMPP
mysql -u root -p

# Inside MySQL:
CREATE DATABASE performance_tracker;
```

## Backend Setup (5 min)
```bash
cd "c:\Users\LENOVO\Documents\Performance Tracker\backend"
npm install
```

Create `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=performance_tracker
JWT_SECRET=your_super_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

Then run:
```bash
npm run dev
```

**Should see**: ✅ Database schema initialized + 🚀 Server running on http://localhost:5000

## Frontend Setup (5 min)
In second terminal:
```bash
cd "c:\Users\LENOVO\Documents\Performance Tracker\frontend"
npm install
npm run dev
```

**Should see**: ➜ Local: http://localhost:5173/

## Test It (2 min)
1. Open http://localhost:5173
2. Click "Register here"
3. Fill form & submit
4. Should redirect to Profile page
5. Click "Edit Profile" → Update → Save
6. Click "Logout"
7. Login with same credentials

---

## If Something Breaks

### Port Already in Use
```bash
# Change PORT in backend/.env (e.g., 5001)
# Change port in frontend/vite.config.ts (port: 5174)
```

### MySQL Connection Error
- Check DATABASE_URL in .env
- Verify MySQL is running
- Check password is correct

### Module Not Found Error
```bash
npm install
```

### Clear Stuck State
Press F12 in browser → Application → Storage → Clear All → Refresh

---

## What's Working Right Now

✅ **Authentication**
- User registration
- User login
- Profile view & edit
- Protected routes
- Logout

✅ **Database**
- PostgreSQL connected
- Users table created
- Ready for daily entries

✅ **Architecture**
- Clean separation (backend/frontend)
- TypeScript for type safety
- React Context for auth state
- JWT tokens for security

---

## Files You Just Created

**Backend (7 files):**
- `src/server.ts` - Main server
- `src/db/pool.ts` - Database connection
- `src/db/schema.ts` - Table creation
- `src/controllers/authController.ts` - Auth logic
- `src/routes/authRoutes.ts` - API endpoints
- `src/middleware/auth.ts` - JWT verification
- `src/utils/jwt.ts` - JWT helpers

**Frontend (5 main files):**
- `src/pages/Register.tsx` - Sign up page
- `src/pages/Login.tsx` - Sign in page
- `src/pages/Profile.tsx` - User profile
- `src/utils/AuthContext.tsx` - Auth state
- `src/utils/api.ts` - API client

**Configuration:**
- Backend: `package.json`, `tsconfig.json`, `.env.example`
- Frontend: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`

**Documentation:**
- `docs/SETUP.md` - Detailed setup guide
- `docs/ROADMAP.md` - Future layers

---

## Next After This Works

Once Layer 1 is fully working:

**Layer 2: Daily Performance Engine**
- Daily entry form
- Score calculation
- Daily log history
- Editable only today

---

## Key Learning Concepts

| Concept | Where | Why |
|---------|-------|-----|
| JWT | Backend auth middleware | Secure authentication |
| React Context | Frontend/utils/AuthContext.tsx | Global state without prop drilling |
| TypeScript | All files | Catch errors before runtime |
| Express Middleware | Backend routes | Reusable logic (auth check) |
| PostgreSQL | Backend queries | Persistent data storage |
| Axios Interceptors | Frontend/utils/api.ts | Auto-add token to requests |
| Protected Routes | Frontend/App.tsx | Only logged-in users access |

---

## How Long to Build Each Layer

- Layer 1 (Auth): **2-3 hours** ✅ Done
- Layer 2 (Daily Tracker): **4-5 hours**
- Layer 3 (Heatmap): **3-4 hours**
- Layer 4 (Skills): **3-4 hours**
- Layer 5 (Career Prep): **8-10 hours** (lots of content)
- Layer 6 (Projects + Tests): **5-6 hours**
- Layer 7 (Analytics): **5-6 hours**

**Total: ~30-40 hours of coding** to build the full system

---

## Most Important: Use It Daily

This system is only valuable if you:
1. Use it every single day
2. Log your performance honestly
3. Review your progress weekly
4. Adjust based on weak areas

The technology is the easy part. **Discipline is the hard part.**

---

**You've got this! 🚀**

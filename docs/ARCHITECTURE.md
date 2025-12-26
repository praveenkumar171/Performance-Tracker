# Architecture & Data Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PERFORMANCE TRACKER OS                  │
│                  (Personal Performance & Career)            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   FRONTEND (React)   │         │  BACKEND (Express)   │
│                      │         │                      │
│  ┌────────────────┐  │         │  ┌────────────────┐  │
│  │ Register Page  │  │         │  │ Auth Routes    │  │
│  ├────────────────┤  │         │  ├────────────────┤  │
│  │  Login Page    │  │────────►│  │ Auth Controller│  │
│  ├────────────────┤  │◄────────│  ├────────────────┤  │
│  │ Profile Page   │  │         │  │ Auth Middleware│  │
│  ├────────────────┤  │         │  ├────────────────┤  │
│  │  AuthContext   │  │         │  │ JWT Utils      │  │
│  └────────────────┘  │         │  └────────────────┘  │
│                      │         │          │            │
│   Port: 5173         │         │   Port: 5000         │
│  (Vite Dev Server)   │         │                      │
└──────────────────────┘         └──────────┬───────────┘
                                            │
                                            ▼
                                 ┌──────────────────────┐
                                 │   PostgreSQL DB      │
                                 │                      │
                                 │  ┌────────────────┐  │
                                 │  │ users table    │  │
                                 │  ├────────────────┤  │
                                 │  │ daily_entries  │  │
                                 │  ├────────────────┤  │
                                 │  │ skills table   │  │
                                 │  └────────────────┘  │
                                 └──────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│              USER REGISTRATION FLOW                     │
└─────────────────────────────────────────────────────────┘

User fills register form
    │
    ▼
Frontend validates input
    │
    ▼
POST /api/auth/register
    {name, email, password, careerGoal}
    │
    ▼
Backend receives request
    │
    ├─ Validate input (required fields)
    │
    ├─ Check if email exists (SELECT * FROM users WHERE email)
    │
    ├─ Hash password (bcryptjs.hash)
    │
    ├─ Create user in PostgreSQL
    │   INSERT INTO users (name, email, password_hash, career_goal)
    │
    ├─ Generate JWT token
    │   jwt.sign({userId, email}, JWT_SECRET, {expiresIn: '7d'})
    │
    ▼
Return { token, user }
    │
    ▼
Frontend stores token in localStorage
Frontend stores user in localStorage
    │
    ▼
Redirect to /profile
    │
    ▼
✅ Registration Complete
```

---

## Request/Response with JWT

```
┌─────────────────────────────────────────────────────────┐
│          PROTECTED ROUTE REQUEST FLOW                   │
└─────────────────────────────────────────────────────────┘

Frontend wants to access protected route (/profile)
    │
    ▼
React checks useAuth() → if no token, redirect to /login
    │
    ▼
If token exists, GET /api/auth/profile
    Headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    │
    ▼
Backend receives request
    │
    ├─ authMiddleware checks header
    │
    ├─ Extract token from "Bearer <token>"
    │
    ├─ jwt.verify(token, JWT_SECRET)
    │
    ├─ If invalid → return 401 Unauthorized
    │
    ├─ If valid → extract userId and email
    │       Set req.userId = userId
    │       Call next()
    │
    ▼
Route handler executes
    │
    ├─ SELECT * FROM users WHERE id = userId
    │
    ▼
Return user data
    │
    ▼
Frontend renders Profile page with data
    │
    ▼
✅ Protected access granted
```

---

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────┐
│              DATABASE SCHEMA                        │
└─────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │     users        │
    │                  │
    │ id (PK)          │  ◄─────────┐
    │ name             │            │
    │ email (UNIQUE)   │            │
    │ password_hash    │            │
    │ career_goal      │            │
    │ joined_date      │            │
    └──────────────────┘            │
            ▲                        │
            │ has many              │ FK: user_id
            │                        │
            │                        ▼
            │               ┌──────────────────────┐
            │               │  daily_entries       │
            │               │                      │
            │               │ id (PK)              │
            │               │ user_id (FK)    ────┘
            │               │ entry_date           │
            │               │ skill_work_points    │
            │               │ career_prep_points   │
            │               │ project_work_points  │
            │               │ total_score          │
            │               │ UNIQUE(user_id,      │
            │               │         entry_date)  │
            │               └──────────────────────┘
            │
            └─ also relates to
            │
            ▼
    ┌──────────────────┐
    │     skills       │
    │                  │
    │ id (PK)          │
    │ user_id (FK) ────┘
    │ skill_name       │
    │ skill_category   │
    │ status           │
    └──────────────────┘

Ready for future layers:
- projects (Layer 6)
- weekly_tests (Layer 6)
- aptitude_topics (Layer 5)
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────┐
│         REACT CONTEXT STATE FLOW                    │
└─────────────────────────────────────────────────────┘

    ┌──────────────────────────────┐
    │    AuthProvider (wrapper)    │
    │                              │
    │  State:                      │
    │  - user (null or user obj)   │
    │  - token (JWT string)        │
    │  - loading (boolean)         │
    │                              │
    │  Methods:                    │
    │  - register()                │
    │  - login()                   │
    │  - logout()                  │
    │  - updateProfile()           │
    └──────────────────────────────┘
               │
               │ provides via Context
               │
               ▼
    ┌──────────────────────────────┐
    │   App.tsx (Routes)           │
    │                              │
    │  <Routes>                    │
    │    /register → Register      │
    │    /login → Login            │
    │    /profile → ProtectedRoute │
    │  </Routes>                   │
    └──────────────────────────────┘
               │
               ├─ Uses useAuth() in each page
               │
               ├─ Register.tsx calls register()
               │  └─ Stores token & user
               │
               ├─ Login.tsx calls login()
               │  └─ Stores token & user
               │
               └─ Profile.tsx calls getProfile()
                  └─ Displays user data
                  └─ Can call updateProfile()
```

---

## Component Hierarchy

```
App.tsx
├── AuthProvider
│   └── BrowserRouter
│       └── Routes
│           ├── /register
│           │   └── Register.tsx
│           │       ├── Form inputs
│           │       ├── useAuth() hook
│           │       ├── API call (register)
│           │       └── useNavigate() redirect
│           │
│           ├── /login
│           │   └── Login.tsx
│           │       ├── Form inputs
│           │       ├── useAuth() hook
│           │       ├── API call (login)
│           │       └── useNavigate() redirect
│           │
│           └── /profile
│               └── ProtectedRoute
│                   └── Profile.tsx
│                       ├── useAuth() hook
│                       ├── Display user data
│                       ├── Edit form
│                       ├── Update profile
│                       └── Logout button
```

---

## API Endpoint Tree

```
/api
├── /auth
│   ├── POST /register
│   │   ├── Request: {name, email, password, careerGoal}
│   │   └── Response: {token, user}
│   │
│   ├── POST /login
│   │   ├── Request: {email, password}
│   │   └── Response: {token, user}
│   │
│   ├── GET /profile (Protected)
│   │   ├── Headers: {Authorization: "Bearer <token>"}
│   │   └── Response: {user}
│   │
│   └── PUT /profile (Protected)
│       ├── Request: {name, careerGoal}
│       └── Response: {user}
│
└── /health
    ├── GET (Public)
    └── Response: {message: "Server is running ✅"}
```

---

## Data Flow: Register → Login → Profile

```
┌────────────────────────────────────────────────────────────┐
│            COMPLETE USER JOURNEY                           │
└────────────────────────────────────────────────────────────┘

1. REGISTER PAGE
   ┌─ User enters: name, email, password, career goal
   │
   └─ onClick handleSubmit():
      ├─ Validate form (empty checks)
      │
      ├─ Call useAuth().register(name, email, password, careerGoal)
      │
      ├─ Frontend API request:
      │  POST /api/auth/register
      │  {name: "John", email: "john@example.com", ...}
      │
      ├─ Backend:
      │  ├─ Validate input
      │  ├─ Check email not used: SELECT * FROM users WHERE email
      │  ├─ Hash password: bcryptjs.hash(password, 10)
      │  ├─ Create user: INSERT INTO users (...)
      │  ├─ Generate token: jwt.sign({userId: 1, email: "john@..."})
      │  └─ Return {token: "eyJhbGciOi...", user: {id, name, email, ...}}
      │
      ├─ Frontend receives response:
      │  ├─ Store token: localStorage.setItem('token', token)
      │  ├─ Store user: localStorage.setItem('user', JSON.stringify(user))
      │  ├─ Update context state
      │  └─ Navigate to /profile
      │
      └─► PROFILE PAGE

2. PROFILE PAGE (First Load)
   ┌─ useEffect runs on mount
   │
   ├─ Check useAuth() → token exists ✓
   │
   ├─ Display user data:
   │  ├─ Name: "John"
   │  ├─ Email: "john@example.com"
   │  ├─ Career Goal: "AI Engineer"
   │  ├─ Joined: "Dec 26, 2025"
   │  ├─ Current Streak: 0 days
   │  └─ Longest Streak: 0 days
   │
   └─ Show buttons: Edit Profile, Logout

3. LOGOUT
   ┌─ onClick handleLogout():
   │
   ├─ Call useAuth().logout()
   │  ├─ Clear context state
   │  └─ localStorage.removeItem('token')
   │
   ├─ Navigate to /login
   │
   └─► LOGIN PAGE

4. LOGIN PAGE
   ┌─ User enters: email, password
   │
   └─ onClick handleSubmit():
      ├─ Call useAuth().login(email, password)
      │
      ├─ Frontend API request:
      │  POST /api/auth/login
      │  {email: "john@example.com", password: "..."}
      │
      ├─ Backend:
      │  ├─ Find user: SELECT * FROM users WHERE email
      │  ├─ Compare password: bcryptjs.compare(password, hash)
      │  ├─ If match: Generate token
      │  └─ Return {token, user}
      │
      ├─ Frontend receives response:
      │  ├─ Store token & user (same as register)
      │  └─ Navigate to /profile
      │
      └─► PROFILE PAGE (Logged in as before)
```

---

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                 FULL STACK                                  │
└─────────────────────────────────────────────────────────────┘

FRONTEND
┌────────────────────────────────────────────┐
│ React 18 (UI Library)                      │
├────────────────────────────────────────────┤
│ ├─ Components (pages, UI)                  │
│ ├─ Hooks (useState, useContext, useEffect) │
│ └─ Router (React Router v6)                │
├────────────────────────────────────────────┤
│ TypeScript (Type Safety)                   │
├────────────────────────────────────────────┤
│ Axios (HTTP Client)                        │
├────────────────────────────────────────────┤
│ Vite (Build Tool)                          │
├────────────────────────────────────────────┤
│ CSS (Styling)                              │
└────────────────────────────────────────────┘
           ▼ HTTP/REST ▼
         port 5173
         localhost

BACKEND
┌────────────────────────────────────────────┐
│ Express.js (Web Framework)                 │
├────────────────────────────────────────────┤
│ ├─ Routes (API endpoints)                  │
│ ├─ Controllers (Business Logic)            │
│ └─ Middleware (Auth checks)                │
├────────────────────────────────────────────┤
│ TypeScript (Type Safety)                   │
├────────────────────────────────────────────┤
│ bcryptjs (Password Hashing)                │
├────────────────────────────────────────────┤
│ JsonWebToken (Auth)                        │
├────────────────────────────────────────────┤
│ Node.js (Runtime)                          │
└────────────────────────────────────────────┘
           ▼ SQL Queries ▼
         port 3306
         localhost

DATABASE
┌────────────────────────────────────────────┐
│ MySQL (Relational DB)                      │
├────────────────────────────────────────────┤
│ ├─ users table                             │
│ ├─ daily_entries table                     │
│ ├─ skills table                            │
│ └─ (future tables for layers 5-7)          │
└────────────────────────────────────────────┘
```

---

**All diagrams show the complete system architecture for Layer 1 (Foundation)**

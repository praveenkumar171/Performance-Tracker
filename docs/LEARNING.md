# Learning Resources & References

## Essential Concepts Explained (For Beginners)

### 1. What is Authentication?
**Simple Explanation**: Making sure you are who you say you are.

**Real-world analogy**: 
- You go to a bank
- You show your ID (register/login)
- They verify it's you
- They give you access to your account
- You show your ID each time you visit (JWT token)

**In our app**:
- Register: Create account with email & password
- Password hashing: Secure storage (not plain text)
- Login: Submit credentials, get token
- Protected routes: Use token to prove you're logged in
- Token expires: Requires re-login for security

---

### 2. What is a JWT Token?
**JWT = JSON Web Token**

**Structure**: `header.payload.signature`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**What's inside**:
- Header: Algorithm (HS256) and type (JWT)
- Payload: User data (userId, email) + expiration
- Signature: Proof token wasn't tampered with

**Why JWT?**
- Stateless (no session storage)
- Portable (works across servers)
- Secure (signed, can't be forged)
- Standard (everyone uses it)

---

### 3. What is Password Hashing?
**Never store passwords as plain text!**

```
❌ WRONG: User table has "password" column with "john123"
✅ RIGHT: User table has "password_hash" with "$2b$10$..."
```

**What bcryptjs does**:
```
Password: "mysecurepass"
  ↓
bcryptjs.hash("mysecurepass", 10)
  ↓
Hash: "$2b$10$N9qo8uCoAu..." (irreversible)
  ↓
Storage: Save hash in database
```

**On login**:
```
User enters: "mysecurepass"
  ↓
bcryptjs.compare("mysecurepass", "$2b$10$N9qo8uCoAu...")
  ↓
Result: true ✅ or false ❌
```

---

### 4. What is React Context?
**Purpose**: Share data across components without prop drilling.

**Without Context (❌ prop drilling)**:
```
App
├── Page (receives userProp)
│   └── Component (receives userProp)
│       └── SubComponent (receives userProp)
│           └── Button (finally uses userProp)
```

**With Context (✅ clean)**:
```
App
├── AuthProvider (provides user via context)
│   └── Page (uses useAuth() → get user)
│   └── Component (uses useAuth() → get user)
│   └── Button (uses useAuth() → get user)
```

**In our code**:
```jsx
// AuthContext provides global state
<AuthProvider>
  <App />
</AuthProvider>

// Any component can use it
const { user, login, logout } = useAuth();
```

---

### 5. What is TypeScript?
**JavaScript with types**.

**Why?**
- Catch errors before running code
- Better IDE autocomplete
- Self-documenting code
- Refactoring is safer

**Example**:
```typescript
// JavaScript ❌
function createUser(user) {
  // What properties does user have?
  // What type is email?
  return user.email.toLowerCase();
}

// TypeScript ✅
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(user: User): string {
  return user.email.toLowerCase();
}
```

---

### 6. What is a Database?
**Organized storage for data**.

**Analogy**: Like a spreadsheet but much more powerful.

**Our PostgreSQL**:
```
┌─── users table ───┐
│ id  | name | email │
├─────┼──────┼───────┤
│ 1   | John | j@... │
│ 2   | Jane | ja... │
└───────────────────┘
```

**SQL Query**: `SELECT * FROM users WHERE email = 'j@example.com'`
**Result**: Returns row with John's data

---

### 7. REST API
**Way to communicate between frontend & backend**.

**REST = REpresentational State Transfer**

**Common HTTP methods**:
- `GET` - Fetch data
- `POST` - Create data
- `PUT` - Update data
- `DELETE` - Remove data

**Our API endpoints**:
```
POST /api/auth/register     ← Create new user
POST /api/auth/login        ← Verify user
GET /api/auth/profile       ← Get user data
PUT /api/auth/profile       ← Update user data
GET /api/health            ← Check if server running
```

---

### 8. What is Express.js?
**Web framework for Node.js**.

**What it does**:
- Listen to HTTP requests
- Route to correct handler
- Run middleware
- Send responses

**Example**:
```typescript
app.post('/api/auth/login', (req, res) => {
  // req = what frontend sent
  // res = what we send back
  res.json({ token: '...', user: {...} });
});
```

---

### 9. What is Vite?
**Modern build tool for frontend**.

**Why Vite?**
- Hot Module Replacement: Code changes appear instantly
- Fast build process
- Optimized for modern browsers
- Great developer experience

---

### 10. What is a Protected Route?
**Only logged-in users can access**.

**Our implementation**:
```typescript
<ProtectedRoute>
  <Profile />
</ProtectedRoute>

// Inside ProtectedRoute:
const { token } = useAuth();
if (!token) {
  return <Navigate to="/login" />;  // Not logged in
}
return children;  // Logged in, show profile
```

---

## Setup Troubleshooting

### Error: Cannot find module 'pg'
**Problem**: Dependencies not installed
**Solution**: 
```bash
cd backend
npm install
```

### Error: ECONNREFUSED 127.0.0.1:5432
**Problem**: PostgreSQL not running
**Solution**:
- Windows: Services → Find "PostgreSQL" → Start it
- Or open pgAdmin from Start menu

### Error: Database does not exist
**Problem**: Haven't created the database
**Solution**:
```bash
psql -U postgres
CREATE DATABASE performance_tracker;
```

### Error: Password authentication failed
**Problem**: Wrong password in .env
**Solution**:
1. If you created PostgreSQL user:
   - Use that username/password in .env
2. If using default postgres:
   - Use the password you set during install
3. Can reset: Use pgAdmin GUI

### Error: Port 5000 already in use
**Problem**: Another app using that port
**Solution**:
```
In backend/.env:
PORT=5001  (or any free port)
```

### Error: "token is invalid"
**Problem**: Token expired or corrupted
**Solution**:
1. Press F12 in browser
2. Application tab → Storage → localhost → Clear All
3. Reload page
4. Login again

---

## Learning Path (Recommended)

### Week 1: Foundations
- [x] Register/Login system
- [x] Password security
- [x] JWT tokens
- [ ] **Next: Build Layer 2**

### Week 2: Daily Tracker
- [ ] Create daily entry form
- [ ] Store daily data
- [ ] Edit/delete entries
- [ ] Calculate scores

### Week 3: Visualization
- [ ] GitHub-style heatmap
- [ ] Streak calculation
- [ ] Statistics dashboard

### Week 4-5: Skills Tracking
- [ ] Skill selection UI
- [ ] Skill status management
- [ ] Progress tracking

### Weeks 6-8: Career Prep
- [ ] Aptitude system
- [ ] Career roadmap
- [ ] Learning content

### Weeks 9-10: Projects & Tests
- [ ] Project portfolio
- [ ] Weekly tests
- [ ] Scoring system

### Weeks 11-12: Analytics & AI
- [ ] Performance dashboard
- [ ] Trend analysis
- [ ] AI mentor (optional)

---

## Useful Resources

### Official Documentation
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Express**: https://expressjs.com
- **PostgreSQL**: https://www.postgresql.org/docs
- **Vite**: https://vitejs.dev

### Learning Websites
- **MDN Web Docs**: https://developer.mozilla.org (HTML, CSS, JS)
- **freeCodeCamp**: https://www.freecodecamp.org (Videos)
- **Scrimba**: https://scrimba.com (Interactive)
- **Codecademy**: https://www.codecademy.com (Interactive)

### Security Learning
- **OWASP**: https://owasp.org (Security best practices)
- **Auth0 Blog**: https://auth0.com/blog (Auth concepts)

### SQL Learning
- **SQL Tutorial**: https://www.w3schools.com/sql
- **PostgreSQL Tutorial**: https://www.postgresqltutorial.com

### Architecture
- **System Design**: https://roadmap.sh
- **REST API Design**: https://restfulapi.net

---

## Key Keyboard Shortcuts

### VS Code
| Shortcut | Action |
|----------|--------|
| Ctrl + ` | Open terminal |
| Ctrl + / | Comment/uncomment |
| Ctrl + S | Save file |
| Ctrl + H | Find & replace |
| Ctrl + Shift + P | Command palette |
| F12 | Browser dev tools |

### Browser Dev Tools
| Shortcut | Action |
|----------|--------|
| Ctrl + Shift + C | Inspect element |
| Ctrl + Shift + J | Console |
| Ctrl + Shift + I | Dev tools (all) |
| F12 | Dev tools |

---

## Common Mistakes to Avoid

❌ **Storing passwords as plain text**
✅ Always hash with bcryptjs

❌ **Committing .env file to Git**
✅ Add to .gitignore

❌ **Using var instead of const/let**
✅ Use const by default, let if needed

❌ **Not validating input on backend**
✅ Always validate (frontend + backend)

❌ **Mixing UI logic with business logic**
✅ Separate: Components (UI) vs Controllers (logic)

❌ **Not handling errors**
✅ Always use try/catch and error responses

❌ **Making requests without error handling**
✅ Catch errors, show user feedback

---

## Code Quality Tips

### 1. **Read Your Code Out Loud**
If you can't explain it, rewrite it.

### 2. **Keep Functions Small**
One function = one responsibility.

### 3. **Use Meaningful Names**
- ❌ `let u = {}`
- ✅ `let user = {}`

### 4. **Add Comments for Why, Not What**
- ❌ `// increment i`
- ✅ `// retry up to 3 times`

### 5. **Test Manually**
- Register with valid data
- Register with invalid data (empty, spaces)
- Login with wrong password
- Logout and re-login
- Edit profile
- Clear localStorage and verify logout works

---

## Git Commands (Once You Add Version Control)

```bash
# Initialize git (once)
git init

# Check status
git status

# Add files
git add .

# Commit
git commit -m "Add Layer 1 authentication"

# View history
git log

# Create branch for Layer 2
git checkout -b layer/2-daily-tracker
```

---

## Performance Optimization Tips

### Frontend
- Use `React.memo` for pure components
- Lazy load components with `React.lazy`
- Optimize images
- Minimize bundle size

### Backend
- Use database indexes
- Implement caching (Redis later)
- Pagination for large datasets
- Connection pooling (already done)

### Database
- Create indexes on frequently queried columns
- Normalize schema
- Use EXPLAIN to analyze queries

---

## Debugging Tips

### 1. **Browser Console**
Press F12 → Console → see errors

### 2. **Backend Logs**
```typescript
console.log('Debug:', variable);  // Temporary
```

### 3. **Network Tab**
F12 → Network → see API requests/responses

### 4. **Database Queries**
```bash
psql -U postgres
\c performance_tracker
SELECT * FROM users;
```

### 5. **Check Environment Variables**
```bash
# In backend code
console.log(process.env.DATABASE_URL);
```

---

## When You Get Stuck

1. **Read the error message carefully**
   - Usually tells you exactly what's wrong
   
2. **Google the error**
   - Others have likely solved it

3. **Check Stack Overflow**
   - Search exact error message

4. **Console.log debugging**
   - Add logs to see what's happening

5. **Ask for help**
   - Describe what you tried
   - Show error message
   - Share relevant code

---

## Final Tips

✅ **Build incrementally**
Don't try to build everything at once.

✅ **Test as you go**
Don't wait until end to test.

✅ **Keep learning**
Read other people's code.

✅ **Use version control (Git)**
Save progress, can revert if needed.

✅ **Document your code**
Future you will thank present you.

✅ **Take breaks**
Tired brain = more bugs.

✅ **Have fun!**
This is YOUR career system.

---

**Remember: The best programmers are those who:**
1. Ask good questions
2. Break problems into small parts
3. Test their code
4. Learn from mistakes
5. Keep practicing

You've got this! 🚀

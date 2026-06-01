# Passport.js Authentication - Detailed Explanation

This document explains how Passport.js authentication works in this project for your viva/project presentation.

---

## 🔐 What is Passport.js?

Passport.js is an **authentication middleware** for Node.js. It's extremely flexible and modular, supporting many different authentication strategies (local, JWT, OAuth, etc.).

In this project, we use **Passport Local Strategy** for email/password authentication.

---

## 🎯 Why Passport.js?

1. **Session-based Authentication**: More secure for admin panels
2. **Flexibility**: Easy to add more strategies later
3. **Middleware Integration**: Seamlessly integrates with Express
4. **Industry Standard**: Widely used and well-documented

---

## 📊 Authentication Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       │
       ▼
┌─────────────────┐
│  Express Server │
│  (Backend)      │
└────────┬────────┘
         │
         │ 2. passport.authenticate('local')
         │
         ▼
┌─────────────────┐
│  Passport.js    │
│  Local Strategy │
└────────┬────────┘
         │
         │ 3. Verify email/password
         │    - Find admin in database
         │    - Compare password with bcrypt
         │
         ▼
┌─────────────────┐
│   MongoDB       │
│   (Admin Model) │
└────────┬────────┘
         │
         │ 4. Return admin object
         │
         ▼
┌─────────────────┐
│  req.logIn()    │
│  Creates Session│
└────────┬────────┘
         │
         │ 5. Serialize user ID to session
         │    - Session stored in memory/server
         │    - Session ID sent as cookie
         │
         ▼
┌─────────────────┐
│   Browser       │
│   (Session      │
│    Cookie)      │
└─────────────────┘

On Subsequent Requests:
┌─────────────┐
│   Browser   │
│  Sends      │
│  Cookie     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Express Session │
│  Reads Session  │
│  from Cookie    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Passport        │
│ Deserialize     │
│ User from ID    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ req.user        │
│ (Admin object)  │
└─────────────────┘
```

---

## 🔄 Step-by-Step Authentication Process

### Step 1: User Login Request

**Frontend (`Login.js`):**
```javascript
const response = await authAPI.login(email, password);
// Sends POST request to /api/auth/login
// Axios configured with withCredentials: true
```

**Why `withCredentials: true`?**
- Enables cookies to be sent with requests
- **CRITICAL** for session-based authentication
- Without this, session cookies won't work

---

### Step 2: Backend Receives Request

**Backend (`authController.js`):**
```javascript
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, admin, info) => {
    // This is where Passport does its magic
  })(req, res, next);
};
```

**What happens here?**
- `passport.authenticate('local')` calls the Local Strategy
- Passport extracts `email` and `password` from `req.body`
- Calls our verify function defined in `config/passport.js`

---

### Step 3: Passport Local Strategy Verification

**Backend (`config/passport.js`):**
```javascript
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',  // Use email instead of username
      passwordField: 'password'
    },
    async (email, password, done) => {
      // 1. Find admin by email
      const admin = await Admin.findOne({ email: email.toLowerCase() });

      // 2. Check if admin exists
      if (!admin) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // 3. Compare password using bcrypt
      const isMatch = await bcrypt.compare(password, admin.password);

      // 4. If password matches, return admin
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // 5. Success - return admin object
      return done(null, admin);
    }
  )
);
```

**The `done` callback:**
- `done(null, admin)` - Success, admin found
- `done(null, false, {message})` - Failure, invalid credentials
- `done(error)` - Server error

---

### Step 4: Session Creation

**Backend (`authController.js`):**
```javascript
req.logIn(admin, (err) => {
  if (err) {
    return res.status(500).json({ message: 'Login failed' });
  }
  // Session is now created!
  return res.status(200).json({
    message: 'Login successful',
    authenticated: true,
    admin: adminData
  });
});
```

**What `req.logIn()` does:**
1. Calls `passport.serializeUser()` to store user ID in session
2. Creates session in express-session store
3. Sends session ID as cookie to browser

---

### Step 5: Serialize User (Store in Session)

**Backend (`config/passport.js`):**
```javascript
passport.serializeUser((admin, done) => {
  done(null, admin._id);  // Store only the ID in session
});
```

**Why only the ID?**
- Sessions are small and efficient
- Full user object can be retrieved later
- Security: Only minimal data in session

---

### Step 6: Cookie Sent to Browser

**Express Session (`server.js`):**
```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,        // true for HTTPS only
      httpOnly: true,       // Cannot be accessed by JavaScript
      maxAge: 24 * 60 * 60 * 1000  // 24 hours
    }
  })
);
```

**Session Cookie:**
- Name: `connect.sid` (default)
- Contains: Session ID (encrypted)
- HttpOnly: Prevents XSS attacks
- Secure: Should be true in production (HTTPS)

---

### Step 7: Subsequent Requests (Deserialization)

**On every protected route request:**

1. Browser sends cookie with session ID
2. Express-session reads cookie and retrieves session
3. Passport deserializes user from session ID

**Backend (`config/passport.js`):**
```javascript
passport.deserializeUser(async (id, done) => {
  try {
    // Retrieve full admin object from database
    const admin = await Admin.findById(id).select('-password');
    done(null, admin);  // Attach to req.user
  } catch (error) {
    done(error, null);
  }
});
```

**Result:**
- `req.user` now contains the full admin object
- `req.isAuthenticated()` returns `true`
- Protected routes can access `req.user`

---

## 🛡️ Protecting Routes

### Backend Protection

**Middleware (`middleware/isAuthenticated.js`):**
```javascript
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();  // User is authenticated, continue
  }
  
  // Not authenticated - return error
  res.status(401).json({ 
    message: 'Unauthorized',
    authenticated: false 
  });
};
```

**Usage in Routes:**
```javascript
router.use(isAuthenticated);  // Protect all routes
// OR
router.get('/blogs', isAuthenticated, blogController.getAllBlogs);
```

### Frontend Protection

**PrivateRoute Component (`components/PrivateRoute.js`):**
```javascript
const PrivateRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
```

---

## 🔓 Logout Process

**Backend (`authController.js`):**
```javascript
exports.logout = (req, res) => {
  req.logout((err) => {
    // req.logout() removes req.user and clears login session
    req.session.destroy((err) => {
      // Destroy the session completely
      res.clearCookie('connect.sid');  // Clear cookie
      res.status(200).json({ 
        message: 'Logout successful',
        authenticated: false 
      });
    });
  });
};
```

**What happens:**
1. `req.logout()` - Removes `req.user`
2. `req.session.destroy()` - Deletes session from store
3. `res.clearCookie()` - Removes cookie from browser

---

## 🔑 Key Concepts Explained

### 1. Session vs JWT

| Feature | Session (What we use) | JWT |
|---------|----------------------|-----|
| Storage | Server-side | Client-side (localStorage/cookie) |
| Revocable | Yes (destroy session) | No (until expiration) |
| Size | Small (just ID) | Larger (full token) |
| Best for | Admin panels, secure apps | Stateless APIs, mobile |

**Why Session for Admin Panel?**
- More secure (can revoke access immediately)
- Better for sensitive operations
- Standard for admin panels

### 2. Password Hashing with bcrypt

**Before Saving (`models/Admin.js`):**
```javascript
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);  // Generate salt
  this.password = await bcrypt.hash(this.password, salt);  // Hash password
  next();
});
```

**During Login (`config/passport.js`):**
```javascript
const isMatch = await bcrypt.compare(password, admin.password);
// Compares plain password with hashed password
```

**Why bcrypt?**
- One-way hashing (cannot decrypt)
- Salt prevents rainbow table attacks
- Slow by design (prevents brute force)

### 3. express-session Configuration

```javascript
app.use(
  session({
    secret: 'your-secret-key',  // Used to sign session ID cookie
    resave: false,              // Don't save session if unchanged
    saveUninitialized: false,   // Don't create session until something stored
    cookie: {
      httpOnly: true,           // Prevents JavaScript access (XSS protection)
      secure: false,            // true = HTTPS only
      maxAge: 86400000          // 24 hours
    }
  })
);
```

---

## 🧪 Testing Authentication Flow

### 1. Test Login

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c cookies.txt  # Save cookies

# Should return:
# {
#   "message": "Login successful",
#   "authenticated": true,
#   "admin": {...}
# }
```

### 2. Test Protected Route with Cookie

```bash
curl http://localhost:5000/api/blogs \
  -b cookies.txt  # Send saved cookies

# Should return blogs array if authenticated
```

### 3. Test Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt

# Should return:
# {
#   "message": "Logout successful",
#   "authenticated": false
# }
```

---

## ❓ Common Questions for Viva

### Q1: Why Passport.js instead of manual authentication?

**Answer:**
- Passport.js is industry-standard and battle-tested
- Supports multiple strategies (can add OAuth later)
- Handles security best practices automatically
- Well-documented and maintained

### Q2: Why session-based instead of JWT?

**Answer:**
- **Security**: Can revoke sessions immediately
- **Control**: Better for admin panels where you need tight control
- **Stateful**: Can track active sessions
- **Standard**: Traditional approach, widely understood

### Q3: How is the session stored?

**Answer:**
- By default, in memory (development)
- In production, use Redis or MongoDB store
- Session ID is encrypted and sent as cookie
- Full session data stays on server

### Q4: What if someone steals the session cookie?

**Answer:**
- **HttpOnly flag**: Prevents JavaScript access (XSS protection)
- **Secure flag**: Only sent over HTTPS (in production)
- **SameSite flag**: Prevents CSRF attacks
- **Session timeout**: Automatically expires
- Can implement IP validation

### Q5: Why bcrypt instead of MD5/SHA for passwords?

**Answer:**
- MD5/SHA are fast hashing algorithms (vulnerable to brute force)
- bcrypt is intentionally slow (configurable rounds)
- bcrypt includes salt automatically
- Industry standard for password hashing

---

## 📝 Code Flow Summary

1. **User enters credentials** → Login form
2. **POST /api/auth/login** → Express route
3. **passport.authenticate('local')** → Passport middleware
4. **Local Strategy verify function** → Check email/password
5. **bcrypt.compare()** → Verify password
6. **req.logIn(admin)** → Create session
7. **passport.serializeUser()** → Store admin ID in session
8. **Cookie sent to browser** → express-session
9. **Subsequent requests** → Cookie sent back
10. **passport.deserializeUser()** → Load admin from DB
11. **req.user available** → Access admin in routes
12. **isAuthenticated middleware** → Check if logged in
13. **Protected routes work** → If authenticated

---

## 🎓 Presentation Tips

When explaining to examiners:

1. **Start with the problem**: Need secure admin authentication
2. **Explain the solution**: Passport.js with Local Strategy
3. **Show the flow**: Use the diagram above
4. **Demonstrate**: Show login process in browser DevTools
5. **Highlight security**: Password hashing, session security, protected routes
6. **Compare alternatives**: Session vs JWT, why we chose session

---

**Remember**: The key to explaining Passport.js is showing how it separates concerns - Passport handles authentication logic, express-session handles session storage, and your code handles business logic.

Good luck with your viva! 🎉


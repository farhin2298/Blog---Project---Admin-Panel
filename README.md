# Blog Admin Panel - Complete MERN Stack Project

A complete Blog Admin Panel built with MERN Stack (MongoDB, Express, React, Node.js) using Passport.js for authentication. This project is designed for college final projects and viva presentations.

## 🎯 Project Overview

This is a **full-stack admin panel** for managing blog posts and categories. Only authenticated admins can access and manage content. The project uses **session-based authentication** with Passport.js (Local Strategy) instead of JWT.

### Key Features

- ✅ **Admin Authentication** using Passport.js (Local Strategy)
- ✅ **Session-based Authentication** (No JWT)
- ✅ **Blog CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Category Management** (Add, Edit, Delete Categories)
- ✅ **Image Upload** using Multer
- ✅ **Search and Filter** blogs by title/description and category
- ✅ **Responsive Design** with Bootstrap
- ✅ **Protected Routes** on both frontend and backend
- ✅ **Modern UI** with professional styling

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- A code editor (VS Code recommended)

---

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>

# Or download and extract the ZIP file
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Setup Backend Environment Variables

1. Create a `.env` file in the `backend` folder:

```bash
cd backend
# Create .env file
```

2. Add the following content to `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-admin
SESSION_SECRET=your-secret-session-key-change-this-in-production
```

**Important:** Change `SESSION_SECRET` to a random secure string in production!

### Step 4: Install Frontend Dependencies

Open a new terminal window and navigate to the frontend folder:

```bash
cd frontend
npm install
```

### Step 5: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If installed as service, MongoDB should start automatically
# Or run manually:
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="C:\data\db"
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# Or
mongod
```

---

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```

The backend server will run on **http://localhost:5000**

### Start Frontend Development Server

Open a **new terminal window**:

```bash
cd frontend
npm start
```

The frontend will automatically open in your browser at **http://localhost:3000**

---

## 🔐 Default Admin Credentials

A default admin user is automatically created when you first run the backend:

- **Email:** `admin@example.com`
- **Password:** `admin123`

**⚠️ Important:** Change these credentials in production!

---

## 📁 Project Structure

```
Blog-final_project_using_passport/
│
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── passport.js        # Passport.js configuration
│   │
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── blogController.js  # Blog CRUD operations
│   │   └── categoryController.js  # Category management
│   │
│   ├── middleware/
│   │   └── isAuthenticated.js # Authentication middleware
│   │
│   ├── models/
│   │   ├── Admin.js           # Admin schema
│   │   ├── Blog.js            # Blog schema
│   │   └── Category.js        # Category schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── blogRoutes.js      # Blog routes
│   │   └── categoryRoutes.js  # Category routes
│   │
│   ├── uploads/               # Image uploads folder
│   │
│   ├── .env                   # Environment variables (create this)
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Main server file
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js       # Login page
│   │   │   ├── Dashboard.js   # Dashboard layout
│   │   │   ├── DashboardHome.js  # Dashboard home page
│   │   │   ├── AddBlog.js     # Add/Edit blog form
│   │   │   ├── AllBlogs.js    # All blogs list
│   │   │   ├── Categories.js  # Category management
│   │   │   └── PrivateRoute.js  # Protected route wrapper
│   │   │
│   │   ├── services/
│   │   │   └── api.js         # Axios API configuration
│   │   │
│   │   ├── App.js             # Main App component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   │
│   ├── .gitignore
│   └── package.json
│
└── README.md                   # This file
```

---

## 🔄 How Passport.js Authentication Works

### Authentication Flow

1. **User Login:**
   - User submits email and password via login form
   - Frontend sends POST request to `/api/auth/login`
   - Passport.js uses Local Strategy to verify credentials
   - If valid, `req.logIn()` creates a session
   - Session is stored server-side using express-session
   - Session ID is sent to browser as cookie

2. **Session Management:**
   - On login, Passport serializes user ID into session
   - On subsequent requests, Passport deserializes user from session
   - `req.isAuthenticated()` checks if session exists
   - `req.user` contains authenticated admin data

3. **Protected Routes:**
   - Backend: `isAuthenticated` middleware checks `req.isAuthenticated()`
   - Frontend: `PrivateRoute` component checks auth status
   - If not authenticated, redirect to login page

4. **Logout:**
   - `req.logout()` destroys the session
   - Session cookie is cleared
   - User redirected to login page

### Key Files:

- **`backend/config/passport.js`**: Passport Local Strategy configuration
- **`backend/middleware/isAuthenticated.js`**: Route protection middleware
- **`backend/controllers/authController.js`**: Login/logout handlers
- **`frontend/src/services/api.js`**: Axios config with `withCredentials: true`

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status

### Blogs
- `GET /api/blogs` - Get all blogs (with search & filter)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (requires auth)
- `PUT /api/blogs/:id` - Update blog (requires auth)
- `DELETE /api/blogs/:id` - Delete blog (requires auth)

### Categories
- `GET /api/categories` - Get all categories (requires auth)
- `GET /api/categories/:id` - Get single category (requires auth)
- `POST /api/categories` - Create category (requires auth)
- `PUT /api/categories/:id` - Update category (requires auth)
- `DELETE /api/categories/:id` - Delete category (requires auth)

---

## 🎨 Frontend Routes

- `/login` - Login page (public)
- `/dashboard` - Dashboard home (protected)
- `/add-blog` - Add new blog (protected)
- `/add-blog?id=<blog_id>` - Edit blog (protected)
- `/blogs` - View all blogs (protected)
- `/categories` - Manage categories (protected)

---

## 💡 Key Technologies Explained

### Backend:

1. **Passport.js**: Authentication middleware
   - Uses Local Strategy for email/password authentication
   - Handles session creation and management

2. **express-session**: Session management
   - Stores session data server-side
   - Creates session cookies

3. **bcryptjs**: Password hashing
   - Securely hashes passwords before storing
   - Compares passwords during login

4. **Multer**: File upload handling
   - Handles multipart/form-data (image uploads)
   - Saves files to `/uploads` folder

5. **Mongoose**: MongoDB ODM
   - Defines schemas and models
   - Handles database operations

### Frontend:

1. **React Router DOM**: Client-side routing
   - Handles navigation between pages
   - Protects routes with PrivateRoute

2. **Axios**: HTTP client
   - `withCredentials: true` enables cookie-based sessions
   - Interceptors handle errors and redirects

3. **Bootstrap**: CSS framework
   - Responsive design components
   - Professional UI styling

---

## 🐛 Troubleshooting

### Backend Issues:

**MongoDB Connection Error:**
```bash
# Make sure MongoDB is running
# Check MONGODB_URI in .env file
# Default: mongodb://localhost:27017/blog-admin
```

**Port Already in Use:**
```bash
# Change PORT in .env file
# Or kill the process using port 5000
```

**Image Upload Not Working:**
```bash
# Make sure uploads/ folder exists in backend/
# Check folder permissions
```

### Frontend Issues:

**CORS Errors:**
```bash
# Check backend/server.js - CORS configuration
# Make sure credentials: true is set
# Frontend should be on http://localhost:3000
```

**Session Not Persisting:**
```bash
# Check axios configuration in services/api.js
# Make sure withCredentials: true is set
# Check browser cookies in DevTools
```

**Cannot Login:**
```bash
# Check default admin credentials
# Verify MongoDB connection
# Check backend logs for errors
```

---

## 📝 For Viva/Project Presentation

### What to Explain:

1. **Passport.js Authentication Flow:**
   - How Local Strategy works
   - Session vs JWT authentication
   - Why we chose session-based auth

2. **MVC Architecture:**
   - Models (Mongoose schemas)
   - Views (React components)
   - Controllers (Business logic)

3. **Security Features:**
   - Password hashing with bcryptjs
   - Session-based authentication
   - Protected routes (frontend & backend)
   - Input validation

4. **File Upload:**
   - Multer configuration
   - Image storage and serving
   - FormData handling

5. **Database Design:**
   - MongoDB schema design
   - Relationships (Blog -> Category)
   - Data validation

---

## 🚀 Deployment Notes

### For Production:

1. **Environment Variables:**
   - Change `SESSION_SECRET` to a secure random string
   - Update `MONGODB_URI` to production database
   - Set `NODE_ENV=production`

2. **Security:**
   - Change default admin credentials
   - Use HTTPS
   - Set secure cookie flags
   - Enable CORS only for your domain

3. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```
   - Serve `build` folder with backend or separate hosting

4. **Backend:**
   - Use process manager (PM2)
   - Set up MongoDB Atlas or dedicated server
   - Configure proper file storage for images

---

## 📄 License

This project is open source and available for educational purposes.

---

## 👨‍💻 Developer Notes

- This project follows MVC (Model-View-Controller) architecture
- All routes except `/api/auth/login` and `/api/auth/check` require authentication
- Images are stored locally in `/uploads` folder (consider cloud storage for production)
- Default admin is created automatically on first run
- All code is well-commented for easy understanding

---

## 🤝 Support

If you encounter any issues:
1. Check the Troubleshooting section
2. Verify all dependencies are installed
3. Check MongoDB is running
4. Review error logs in console
5. Ensure .env file is properly configured

---

**Happy Coding! 🎉**

For questions or issues, please check the code comments - everything is explained in detail.


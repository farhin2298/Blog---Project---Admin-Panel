# Quick Start Guide

Follow these steps to get your Blog Admin Panel running in 5 minutes!

## Prerequisites Check ✅

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] Terminal/Command Prompt ready

---

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

Wait for installation to complete...

---

## Step 2: Create Backend .env File

In the `backend` folder, create a file named `.env` with this content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-admin
SESSION_SECRET=my-secret-key-change-this-12345
```

**Save the file as `.env` (not `.env.txt` or anything else)**

---

## Step 3: Start MongoDB

**Windows:**
- If installed as service: It should already be running
- Check Task Manager for `mongod.exe`
- If not running, start MongoDB service from Services

**Mac/Linux:**
```bash
sudo systemctl start mongod
# Or
mongod
```

**Verify MongoDB is running:**
```bash
# Should show MongoDB connection
mongosh
# Then type: exit
```

---

## Step 4: Start Backend Server

In the `backend` folder terminal:

```bash
npm start
```

You should see:
```
MongoDB Connected: localhost
Default admin created: admin@example.com / admin123
Server is running on port 5000
```

**Keep this terminal running!**

---

## Step 5: Install Frontend Dependencies

**Open a NEW terminal window:**

```bash
cd frontend
npm install
```

Wait for installation...

---

## Step 6: Start Frontend

In the `frontend` folder terminal:

```bash
npm start
```

React will automatically open your browser at `http://localhost:3000`

---

## Step 7: Login

You should see the login page. Use these credentials:

- **Email:** `admin@example.com`
- **Password:** `admin123`

Click **Login** and you're in! 🎉

---

## ✅ Verification Checklist

After logging in, verify:

- [ ] Dashboard page loads
- [ ] Sidebar navigation works
- [ ] Can click "Add Blog"
- [ ] Can click "All Blogs"
- [ ] Can click "Categories"
- [ ] Logout works

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB connection error`

**Solution:**
1. Check if MongoDB is running
2. Verify `MONGODB_URI` in `.env` file
3. Default should be: `mongodb://localhost:27017/blog-admin`

### Port Already in Use

**Error:** `Port 5000 already in use`

**Solution:**
1. Change `PORT=5000` to `PORT=5001` in `.env`
2. Update frontend `.env` if you have one
3. Or kill the process using port 5000

### Cannot Login

**Error:** Login fails or returns error

**Solution:**
1. Check backend terminal for errors
2. Verify MongoDB is running
3. Check default admin was created (see backend logs)
4. Verify email/password: `admin@example.com` / `admin123`

### Frontend Cannot Connect to Backend

**Error:** Network error or CORS error

**Solution:**
1. Verify backend is running on port 5000
2. Check `http://localhost:5000/api/test` in browser
3. Should return: `{"message": "Server is running!"}`
4. Check frontend `src/services/api.js` - baseURL should be `http://localhost:5000/api`

---

## 📝 Next Steps

1. ✅ Everything working? Great!
2. 📖 Read `README.md` for detailed documentation
3. 📚 Read `PASSPORT_AUTHENTICATION_EXPLANATION.md` for viva prep
4. 🎨 Customize the design if needed
5. 🚀 Deploy for production

---

## 💡 Pro Tips

- **Keep both terminals open** (backend + frontend)
- **Check terminal logs** if something doesn't work
- **Use browser DevTools** (F12) to see network requests
- **Clear browser cookies** if session issues occur

---

**Need Help?** Check the full `README.md` for detailed troubleshooting and explanations.

Happy coding! 🚀


const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create default admin if it doesn't exist
    await createDefaultAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Function to create default admin user
const createDefaultAdmin = async () => {
  try {
    const Admin = require('../models/Admin');
    const bcrypt = require('bcryptjs');

    // Check if admin exists
    const adminExists = await Admin.findOne({ email: 'admin@example.com' });

    if (!adminExists) {
      // Create default admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new Admin({
        email: 'admin@example.com',
        password: hashedPassword
      });
      await admin.save();
      console.log('Default admin created: admin@example.com / admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

module.exports = connectDB;


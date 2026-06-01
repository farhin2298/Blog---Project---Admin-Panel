const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

/**
 * Passport.js Local Strategy Configuration
 * 
 * How Passport.js works:
 * 1. When user submits login form, passport.authenticate() is called
 * 2. Passport uses the LocalStrategy to verify credentials
 * 3. The verify function checks email and password
 * 4. If valid, user object is attached to req.user and session is created
 * 5. Session is stored in express-session (server-side)
 * 6. On subsequent requests, passport deserializes user from session
 */

module.exports = function(passport) {
  // Local Strategy - Email and Password authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // Use 'email' instead of default 'username'
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          // Find admin by email
          const admin = await Admin.findOne({ email: email.toLowerCase() });

          if (!admin) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          // Compare password with hashed password
          const isMatch = await bcrypt.compare(password, admin.password);

          if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          // Authentication successful
          return done(null, admin);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize user for session (store user ID in session)
  passport.serializeUser((admin, done) => {
    done(null, admin._id);
  });

  // Deserialize user from session (retrieve full user object from ID)
  passport.deserializeUser(async (id, done) => {
    try {
      const admin = await Admin.findById(id).select('-password'); // Exclude password
      done(null, admin);
    } catch (error) {
      done(error, null);
    }
  });
};


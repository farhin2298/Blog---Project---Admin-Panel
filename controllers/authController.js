const passport = require('passport');

/**
 * Login Controller
 * Uses Passport.js Local Strategy for authentication
 */
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, admin, info) => {
    if (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    if (!admin) {
      return res.status(401).json({ 
        message: info.message || 'Invalid email or password',
        authenticated: false 
      });
    }

    // Log in the admin (creates session)
    req.logIn(admin, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed', error: err.message });
      }

      // Remove password from response
      const adminData = {
        _id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt
      };

      return res.status(200).json({
        message: 'Login successful',
        authenticated: true,
        admin: adminData
      });
    });
  })(req, res, next);
};

/**
 * Logout Controller
 * Destroys the session using req.logout()
 */
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session destroy failed', error: err.message });
      }

      res.clearCookie('connect.sid'); // Clear session cookie
      res.status(200).json({ 
        message: 'Logout successful',
        authenticated: false 
      });
    });
  });
};

/**
 * Check Authentication Status
 * Returns current authenticated admin if session exists
 */
exports.checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    const adminData = {
      _id: req.user._id,
      email: req.user.email,
      createdAt: req.user.createdAt
    };

    return res.status(200).json({
      authenticated: true,
      admin: adminData
    });
  }

  res.status(401).json({
    authenticated: false,
    message: 'Not authenticated'
  });
};


/**
 * Authentication Middleware
 * 
 * This middleware checks if the user is authenticated using Passport.js
 * It verifies that req.user exists (set by passport.deserializeUser)
 * If not authenticated, returns 401 Unauthorized
 */

module.exports = (req, res, next) => {
  // Passport.js sets req.user when user is authenticated
  if (req.isAuthenticated()) {
    return next();
  }
  
  // If not authenticated, return error
  res.status(401).json({ 
    message: 'Unauthorized. Please login to access this resource.',
    authenticated: false 
  });
};


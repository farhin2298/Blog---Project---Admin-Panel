import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardHome from './components/DashboardHome';
import AddBlog from './components/AddBlog';
import AllBlogs from './components/AllBlogs';
import Categories from './components/Categories';
import PrivateRoute from './components/PrivateRoute';

/**
 * Main App Component
 * 
 * Handles authentication state and routing
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();
  }, []);

  /**
   * Check if user is authenticated
   * Called on app mount and after login/logout
   */
  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.checkAuth();
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle login success
   * Updates authentication state
   */
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  /**
   * Handle logout
   * Updates authentication state
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={handleLogout}>
                <DashboardHome />
              </Dashboard>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-blog"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={handleLogout}>
                <AddBlog />
              </Dashboard>
            </PrivateRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={handleLogout}>
                <AllBlogs />
              </Dashboard>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={handleLogout}>
                <Categories />
              </Dashboard>
            </PrivateRoute>
          }
        />

        {/* Default Route - Redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


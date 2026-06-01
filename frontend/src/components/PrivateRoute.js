import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Private Route Component
 * 
 * Protects routes that require authentication
 * Redirects to login if not authenticated
 */
const PrivateRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated === null) {
    // Still checking authentication
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not authenticated - redirect to login
    return <Navigate to="/login" replace />;
  }

  // Authenticated - render protected component
  return children;
};

export default PrivateRoute;


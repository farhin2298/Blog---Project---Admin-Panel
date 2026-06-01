import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css';

/**
 * Login Component
 * 
 * Handles admin authentication using Passport.js
 * Email and password based login
 */
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  /**
   * Handle input change
   */
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  /**
   * Handle form submission
   * Calls Passport.js login endpoint
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);

      if (response.data.authenticated) {
        // Login successful - callback will update App state
        onLogin();
        // Redirect handled by App.js
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Admin Login</h2>
          <p>Sign in to manage your blog</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer mt-4">
          <small className="text-muted">
            Default credentials: admin@example.com / admin123
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;


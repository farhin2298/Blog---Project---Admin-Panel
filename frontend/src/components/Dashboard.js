import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Dashboard.css';
import { FiHome, FiPlusSquare, FiFileText, FiTag, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

/**
 * Dashboard Component
 * 
 * Main layout for admin panel with sidebar navigation
 * Contains sidebar, top navbar, and main content area
 */
const Dashboard = ({ onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch admin data
    fetchAdminData();
  }, []);

  /**
   * Fetch current admin data
   */
  const fetchAdminData = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response.data.authenticated) {
        setAdmin(response.data.admin);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Still call onLogout to clear local state
      onLogout();
    }
  };

  /**
   * Check if route is active
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h4>Blog Admin</h4>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <FiHome className="nav-icon" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link
            to="/add-blog"
            className={`nav-item ${isActive('/add-blog') ? 'active' : ''}`}
          >
            <FiPlusSquare className="nav-icon" />
            {sidebarOpen && <span>Add Blog</span>}
          </Link>

          <Link
            to="/blogs"
            className={`nav-item ${isActive('/blogs') ? 'active' : ''}`}
          >
            <FiFileText className="nav-icon" />
            {sidebarOpen && <span>All Blogs</span>}
          </Link>

          <Link
            to="/categories"
            className={`nav-item ${isActive('/categories') ? 'active' : ''}`}
          >
            <FiTag className="nav-icon" />
            {sidebarOpen && <span>Categories</span>}
          </Link>

          <button
            className="nav-item logout-btn"
            onClick={handleLogout}
          >
            <FiLogOut className="nav-icon" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="navbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu />
            </button>
            <h5 className="page-title">
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname === '/add-blog' && 'Add New Blog'}
              {location.pathname === '/blogs' && 'All Blogs'}
              {location.pathname === '/categories' && 'Categories'}
            </h5>
          </div>

          <div className="navbar-right">
            {admin && (
              <div className="admin-profile">
                <div className="admin-avatar">
                  {admin.email.charAt(0).toUpperCase()}
                </div>
                <div className="admin-info">
                  <span className="admin-name">Admin</span>
                  <span className="admin-email">{admin.email}</span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


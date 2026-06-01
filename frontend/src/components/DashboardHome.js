import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI, categoryAPI } from '../services/api';
import { FiFileText, FiTag, FiPlusSquare, FiTrendingUp } from 'react-icons/fi';
import './DashboardHome.css';

/**
 * Dashboard Home Component
 * 
 * Main dashboard page showing statistics and overview
 */
const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalCategories: 0,
    recentBlogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetch dashboard statistics
   */
  const fetchDashboardData = async () => {
    try {
      const [blogsRes, categoriesRes] = await Promise.all([
        blogAPI.getAll(),
        categoryAPI.getAll()
      ]);

      const recentBlogs = blogsRes.data.data.slice(0, 5);

      setStats({
        totalBlogs: blogsRes.data.count || 0,
        totalCategories: categoriesRes.data.count || 0,
        recentBlogs: recentBlogs
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <div className="welcome-section mb-4">
        <h2>Welcome to Blog Admin Panel</h2>
        <p className="text-muted">Manage your blogs, categories, and content from here.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-icon blogs">
            <FiFileText />
          </div>
          <div className="stat-content">
            <h3>{stats.totalBlogs}</h3>
            <p>Total Blogs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon categories">
            <FiTag />
          </div>
          <div className="stat-content">
            <h3>{stats.totalCategories}</h3>
            <p>Categories</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon trending">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <h3>{stats.recentBlogs.length}</h3>
            <p>Recent Posts</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions mb-4">
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <Link to="/add-blog" className="btn btn-primary">
            <FiPlusSquare className="me-2" />
            Add New Blog
          </Link>
          <Link to="/blogs" className="btn btn-outline-primary">
            <FiFileText className="me-2" />
            View All Blogs
          </Link>
          <Link to="/categories" className="btn btn-outline-primary">
            <FiTag className="me-2" />
            Manage Categories
          </Link>
        </div>
      </div>

      {/* Recent Blogs */}
      <div className="recent-blogs">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Recent Blogs</h4>
          <Link to="/blogs" className="text-decoration-none">View All -&gt;</Link>
        </div>

        {stats.recentBlogs.length === 0 ? (
          <div className="empty-state">
            <FiFileText size={48} className="text-muted mb-3" />
            <p className="text-muted">No blogs yet. Create your first blog!</p>
            <Link to="/add-blog" className="btn btn-primary mt-2">
              Add New Blog
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBlogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>
                      <strong>{blog.title}</strong>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {blog.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td>{blog.author}</td>
                    <td>{new Date(blog.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;


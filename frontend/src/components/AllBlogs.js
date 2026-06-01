import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI, categoryAPI } from '../services/api';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiEye } from 'react-icons/fi';
import './AllBlogs.css';

/**
 * All Blogs Component
 * 
 * Display all blogs in table format
 * Includes search, filter, edit, and delete functionality
 */
const AllBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  /**
   * Fetch all categories for filter
   */
  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  /**
   * Fetch all blogs
   */
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll(searchTerm, selectedCategory || undefined);
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blogs when search or filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  /**
   * Handle edit blog
   */
  const handleEdit = (id) => {
    navigate(`/add-blog?id=${id}`);
  };

  /**
   * Handle delete blog
   */
  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      const response = await blogAPI.delete(id);
      if (response.data.success) {
        // Remove from list
        setBlogs(blogs.filter((blog) => blog._id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Truncate text
   */
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="blogs-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="all-blogs-container">
      {/* Header with Actions */}
      <div className="blogs-header mb-4">
        <div>
          <h4>All Blogs</h4>
          <p className="text-muted mb-0">Manage your blog posts</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/add-blog')}
        >
          <FiPlus className="me-2" />
          Add New Blog
        </button>
      </div>

      {/* Search and Filter */}
      <div className="blogs-filters mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Search blogs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      {blogs.length === 0 ? (
        <div className="empty-state">
          <FiEye size={48} className="text-muted mb-3" />
          <h5>No blogs found</h5>
          <p className="text-muted">
            {searchTerm || selectedCategory
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first blog post to get started.'}
          </p>
          {!searchTerm && !selectedCategory && (
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate('/add-blog')}
            >
              <FiPlus className="me-2" />
              Add New Blog
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    {blog.image ? (
                      <img
                        src={`http://localhost:5000${blog.image}`}
                        alt={blog.title}
                        className="blog-thumbnail"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>
                    <div className="blog-title-cell">
                      <strong>{blog.title}</strong>
                      <small className="text-muted d-block">
                        {truncateText(blog.description, 60)}
                      </small>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-secondary">
                      {blog.category?.name || 'N/A'}
                    </span>
                  </td>
                  <td>{blog.author}</td>
                  <td>{formatDate(blog.date)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(blog._id)}
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteConfirm(blog)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setDeleteConfirm(null)}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>?
              </p>
              <p className="text-muted small mb-0">
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;


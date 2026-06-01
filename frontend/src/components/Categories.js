import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { FiEdit, FiTrash2, FiPlus, FiTag, FiX, FiSave } from 'react-icons/fi';
import './Categories.css';

/**
 * Categories Component
 * 
 * Manage blog categories
 * Add, edit, and delete categories
 */
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetch all categories
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input change
   */
  const onChange = (e) => {
    setFormData({ name: e.target.value });
    setError('');
  };

  /**
   * Handle form submission (create or update)
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingCategory) {
        // Update category
        const response = await categoryAPI.update(editingCategory._id, formData.name);
        if (response.data.success) {
          // Update in list
          setCategories(
            categories.map((cat) =>
              cat._id === editingCategory._id ? response.data.data : cat
            )
          );
          resetForm();
        }
      } else {
        // Create category
        const response = await categoryAPI.create(formData.name);
        if (response.data.success) {
          // Add to list
          setCategories([...categories, response.data.data]);
          resetForm();
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        `Failed to ${editingCategory ? 'update' : 'create'} category. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle edit category
   */
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowForm(true);
    setError('');
  };

  /**
   * Handle delete category
   */
  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      const response = await categoryAPI.delete(id);
      if (response.data.success) {
        // Remove from list
        setCategories(categories.filter((cat) => cat._id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      alert(errorMessage);
      if (errorMessage.includes('used in')) {
        setDeleteConfirm(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({ name: '' });
    setEditingCategory(null);
    setShowForm(false);
    setError('');
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    resetForm();
  };

  if (loading && categories.length === 0) {
    return (
      <div className="categories-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      {/* Header */}
      <div className="categories-header mb-4">
        <div>
          <h4>Categories</h4>
          <p className="text-muted mb-0">Manage blog categories</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          disabled={showForm}
        >
          <FiPlus className="me-2" />
          Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="category-form-card mb-4">
          <div className="form-header">
            <h5>{editingCategory ? 'Edit Category' : 'Add New Category'}</h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleCancel}
            >
              <FiX />
            </button>
          </div>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-3">
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">
                Category Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="categoryName"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter category name"
                required
                autoFocus
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {editingCategory ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FiSave className="me-2" />
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="empty-state">
          <FiTag size={48} className="text-muted mb-3" />
          <h5>No categories found</h5>
          <p className="text-muted">
            Create your first category to organize your blogs.
          </p>
          {!showForm && (
            <button
              className="btn btn-primary mt-3"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <FiPlus className="me-2" />
              Add Category
            </button>
          )}
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-icon">
                <FiTag />
              </div>
              <div className="category-content">
                <h6 className="category-name">{category.name}</h6>
                <small className="text-muted">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </small>
              </div>
              <div className="category-actions">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEdit(category)}
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setDeleteConfirm(category)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
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
                Are you sure you want to delete category{' '}
                <strong>"{deleteConfirm.name}"</strong>?
              </p>
              <p className="text-muted small mb-0">
                This action cannot be undone. If this category is used in any blogs, you'll need to
                remove or reassign them first.
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

export default Categories;


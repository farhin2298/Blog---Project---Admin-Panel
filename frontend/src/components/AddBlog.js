import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI, categoryAPI } from '../services/api';
import { FiUpload, FiSave, FiX } from 'react-icons/fi';
import './AddBlog.css';

/**
 * Add Blog Component
 * 
 * Form to create new blog posts
 * Includes image upload using FormData
 */
const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    author: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [blogId, setBlogId] = useState(null);

  useEffect(() => {
    fetchCategories();
    // Check if editing (blog ID in URL)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setEditMode(true);
      setBlogId(id);
      fetchBlog(id);
    }
  }, []);

  /**
   * Fetch all categories
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
   * Fetch blog data for editing
   */
  const fetchBlog = async (id) => {
    try {
      const response = await blogAPI.getById(id);
      const blog = response.data.data;
      setFormData({
        title: blog.title,
        description: blog.description,
        category: blog.category._id || blog.category,
        author: blog.author,
        date: new Date(blog.date).toISOString().split('T')[0]
      });
      if (blog.image) {
        setImagePreview(`http://localhost:5000${blog.image}`);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog data');
    }
  };

  /**
   * Handle input change
   */
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  /**
   * Handle image file selection
   */
  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImage(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Remove selected image
   */
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  /**
   * Handle form submission
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create FormData for multipart/form-data
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('author', formData.author);
      data.append('date', formData.date);

      if (image) {
        data.append('image', image);
      }

      let response;
      if (editMode) {
        response = await blogAPI.update(blogId, data);
      } else {
        response = await blogAPI.create(data);
      }

      if (response.data.success) {
        // Success - redirect to blogs page
        navigate('/blogs');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        `Failed to ${editMode ? 'update' : 'create'} blog. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    navigate('/blogs');
  };

  return (
    <div className="add-blog-container">
      <div className="blog-form-card">
        <div className="form-header">
          <h4>{editMode ? 'Edit Blog' : 'Add New Blog'}</h4>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleCancel}
          >
            <FiX className="me-1" />
            Cancel
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="Enter blog title"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={onChange}
              placeholder="Enter blog description"
              required
            ></textarea>
          </div>

          {/* Category and Author Row */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="category" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="category"
                name="category"
                value={formData.category}
                onChange={onChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="author" className="form-label">
                Author <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="author"
                name="author"
                value={formData.author}
                onChange={onChange}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={formData.date}
              onChange={onChange}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="form-label">
              Blog Image
            </label>
            <div className="image-upload-section">
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger remove-image-btn"
                    onClick={removeImage}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <label htmlFor="image" className="image-upload-label">
                  <FiUpload className="upload-icon" />
                  <span>Click to upload image</span>
                  <small className="text-muted d-block mt-2">
                    PNG, JPG, GIF up to 5MB
                  </small>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={onImageChange}
                    className="d-none"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FiSave className="me-2" />
                  {editMode ? 'Update Blog' : 'Create Blog'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;


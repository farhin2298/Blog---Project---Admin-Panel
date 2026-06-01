import axios from 'axios';

/**
 * Axios Configuration
 * 
 * Base URL points to backend API
 * withCredentials: true is IMPORTANT for session-based authentication
 * This allows cookies to be sent with requests
 */

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // CRITICAL: Required for session cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  logout: () => API.post('/auth/logout'),
  checkAuth: () => API.get('/auth/check')
};

// Blog API
export const blogAPI = {
  getAll: (search, category) => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    return API.get('/blogs', { params });
  },
  getById: (id) => API.get(`/blogs/${id}`),
  create: (formData) => API.post('/blogs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  update: (id, formData) => API.put(`/blogs/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  delete: (id) => API.delete(`/blogs/${id}`)
};

// Category API
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getById: (id) => API.get(`/categories/${id}`),
  create: (name) => API.post('/categories', { name }),
  update: (id, name) => API.put(`/categories/${id}`, { name }),
  delete: (id) => API.delete(`/categories/${id}`)
};

export default API;


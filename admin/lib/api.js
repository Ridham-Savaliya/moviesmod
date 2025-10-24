import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apimoviesmod.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Movies API
export const moviesAPI = {
  getAll: (params) => api.get('/admin/movies', { params }),
  getById: (id) => api.get(`/admin/movies/${id}`),
  create: (data) => api.post('/admin/movies', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/admin/movies/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/admin/movies/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/admin/categories'),
  create: (data) => api.post('/admin/categories', data),
  update: (id, data) => api.put(`/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/admin/categories/${id}`),
};

// Feedback API
export const feedbackAPI = {
  getAll: (params) => api.get('/admin/feedback', { params }),
  updateStatus: (id, status) => api.put(`/admin/feedback/${id}/status`, { status }),
  delete: (id) => api.delete(`/admin/feedback/${id}`),
};

// Ad Slots API
export const adSlotsAPI = {
  getAll: () => api.get('/admin/ad-slots'),
  create: (data) => api.post('/admin/ad-slots', data),
  update: (id, data) => api.put(`/admin/ad-slots/${id}`, data),
  delete: (id) => api.delete(`/admin/ad-slots/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getMovieAnalytics: (id) => api.get(`/analytics/movies/${id}`),
};

export default api;

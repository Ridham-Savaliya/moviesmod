import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apimoviesmod.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movies API
export const moviesAPI = {
  getAll: (params) => api.get('/movies', { params }),
  getBySlug: (slug) => api.get(`/movies/${slug}`),
  getRelated: (slug, limit = 6) => api.get(`/movies/${slug}/related`, { params: { limit } }),
  getTrending: (limit = 10) => api.get('/movies/trending', { params: { limit } }),
  getSearchSuggestions: (query) => api.get('/movies/search-suggestions', { params: { q: query } }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// Feedback API
export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
  getByMovie: (movieId, page = 1, limit = 10) => 
    api.get(`/feedback/${movieId}`, { params: { page, limit } }),
};

export default api;

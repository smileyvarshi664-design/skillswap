import axios from 'axios';

// Sanitize and normalize API Base URL so invalid formatting never breaks requests
const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL;

  // If missing, empty, or still contains template placeholder brackets '<...>'
  if (!url || typeof url !== 'string' || url.trim() === '' || url.includes('<') || url.includes('>')) {
    return 'https://skillswap-f0v6.onrender.com/api';
  }

  // Trim and remove any accidental surrounding quotes or prefixes
  url = url.trim().replace(/^["']|["']$/g, '');
  if (url.includes('=')) {
    url = url.split('=').pop().trim();
  }
  // Ensure protocol is present
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  // Remove trailing slashes
  url = url.replace(/\/+$/, '');
  // Ensure /api suffix
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillswap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic error messaging or 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login or register endpoints
      const isAuthRoute =
        error.config.url.includes('/auth/login') ||
        error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('skillswap_token');
        localStorage.removeItem('skillswap_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// User Services
export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};

// Skill Services
export const skillService = {
  getMySkills: () => api.get('/skills/my'),
  addSkill: (skillData) => api.post('/skills', skillData),
  updateSkill: (id, skillData) => api.put(`/skills/${id}`, skillData),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
  exploreSkills: () => api.get('/skills/explore'),
};

// Matching Service
export const matchService = {
  getMatches: () => api.get('/matches'),
};

// Exchange Request Services
export const requestService = {
  sendRequest: (data) => api.post('/requests', data),
  getReceivedRequests: () => api.get('/requests/received'),
  getSentRequests: () => api.get('/requests/sent'),
  acceptRequest: (id) => api.put(`/requests/${id}/accept`),
  rejectRequest: (id) => api.put(`/requests/${id}/reject`),
  cancelRequest: (id) => api.put(`/requests/${id}/cancel`),
};

// Exchange Services
export const exchangeService = {
  getMyExchanges: () => api.get('/exchanges'),
  completeExchange: (id) => api.put(`/exchanges/${id}/complete`),
};

// Feedback Services
export const feedbackService = {
  createFeedback: (feedbackData) => api.post('/feedback', feedbackData),
  getUserFeedback: (userId) => api.get(`/feedback/${userId}`),
};

// Admin Services
export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  getAllRequests: () => api.get('/admin/requests'),
};

export default api;

import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Don't show toast for 401 (unauthorized) errors
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    
    // If token is invalid or expired, clear it and redirect to login
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      return data.user;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      toast.success('Registration successful! Please login.');
      return data.user;
    } catch (error) {
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const { data } = await api.get('/auth/profile');
      return data.user;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      throw error;
    }
  }
};

export const dashboard = {
  getData: async () => {
    try {
      const { data } = await api.get('/dashboard/data');
      return data.data;
    } catch (error) {
      throw error;
    }
  },
  
  getStats: async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      return data.stats;
    } catch (error) {
      throw error;
    }
  }
};

export default api;

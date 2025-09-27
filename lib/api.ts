import axios, { AxiosResponse } from 'axios';
import { getAuthToken, setAuthToken, setUserData } from './authStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUserData(null)
      setAuthToken('')
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response: AxiosResponse = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    role?: string 
  }) => {
    const response: AxiosResponse = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response: AxiosResponse = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: { 
    email?: string; 
    firstName?: string; 
    lastName?: string 
  }) => {
    const response: AxiosResponse = await api.put('/auth/profile', userData);
    return response.data;
  },

  logout: async () => {
    const response: AxiosResponse = await api.post('/auth/logout');
    return response.data;
  },

  // Bulk delete users (Admin only)
  bulkDeleteUsers: async (userIds: number[]) => {
    const response: AxiosResponse = await api.delete('/auth/users/bulk', {
      data: { userIds }
    });
    return response.data;
  },

  // Delete user data (Admin only) - Cascade deletion
  deleteUserData: async (userId: number) => {
    const response: AxiosResponse = await api.delete(`/auth/users/${userId}/data`);
    return response.data;
  },
};

export default api;

import api from './api';
import { User } from '@/types/auth';

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'user';
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export const usersAPI = {
  // Get all users with pagination and filters (Admin only)
  getUsers: async (filters: UserFilters = {}): Promise<UsersResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);

    const response = await api.get(`/auth/users?${params.toString()}`);
    const data = response.data;
    
    console.log('Raw API response:', data);
    
    // Handle the specific API response format: { message: "...", users: [...] }
    if (data && data.users && Array.isArray(data.users)) {
      const transformedData = {
        data: data.users,
        total: data.users.length,
        page: filters.page || 1,
        limit: filters.limit || data.users.length,
        totalPages: 1,
      };
      console.log('Transformed data:', transformedData);
      return transformedData;
    }
    
    // Handle direct array response
    if (Array.isArray(data)) {
      return {
        data: data,
        total: data.length,
        page: filters.page || 1,
        limit: filters.limit || data.length,
        totalPages: 1,
      };
    }
    
    // If API returns paginated format, return as is
    return data;
  },

  // Get user by ID (Admin only)
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
  },

  // Create new user (Admin only)
  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (id: number, userData: UpdateUserData): Promise<User> => {
    const response = await api.patch(`/auth/users/${id}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/auth/users/${id}`);
  },

  // Get user statistics (Admin only)
  getUserStats: async () => {
    const response = await api.get('/auth/users/stats');
    return response.data;
  },
};

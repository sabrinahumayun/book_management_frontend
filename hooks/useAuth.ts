import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { LoginCredentials, RegisterData, User, AuthResponse } from '@/types/auth';
import { setAuthToken, getAuthToken, removeAuthToken, setUser, getUser, removeUser } from '@/lib/authStorage';
import { toast } from 'react-toastify';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Get current user from localStorage
const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    localStorage.removeItem('user');
    return null;
  }
};

const getCurrentToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Custom hook for authentication
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsInitialized(true);
    }
  }, []);

  // Get current user query (only for refreshing data)
  const { data: refreshedUser, isLoading: isUserLoading } = useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        return null;
      }
      
      const token = getCurrentToken();
      if (!token) return null;
      
      try {
        const response = await authAPI.getProfile();
        return response.user || null;
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        return null;
      }
    },
    enabled: isInitialized && !!user && !!getCurrentToken(), // Only run if we have a user, are initialized, and have a token
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Update user when refreshed data comes in
  useEffect(() => {
    if (refreshedUser !== undefined) {
      setUser(refreshedUser);
    }
  }, [refreshedUser]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
    onSuccess: (response: AuthResponse) => {
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setAuthToken(response.access_token);
      setUser(response.user);
      queryClient.setQueryData(authKeys.profile(), response.user);
      
      // Show success toast
      toast.success(`Welcome back, ${response.user.firstName}! 🎉`);
      
      // Redirect based on user role
      const redirectPath = response.user.role === 'admin' ? '/admin/dashboard' : '/books';
      router.push(redirectPath);
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authAPI.register(userData),
    onSuccess: (response: AuthResponse) => {
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      queryClient.setQueryData(authKeys.profile(), response.user);
      
      // Show success toast
      toast.success(`Welcome to Book Portal, ${response.user.firstName}! 🚀`);
      
      // Redirect based on user role
      const redirectPath = response.user.role === 'admin' ? '/admin/dashboard' : '/books';
      router.push(redirectPath);
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<User>) => authAPI.updateProfile(userData),
    onSuccess: (response) => {
      const updatedUser = { ...user, ...response.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      queryClient.setQueryData(authKeys.profile(), updatedUser);
      
      // Show success toast
      toast.success('Profile updated successfully! ✨');
    },
    onError: (error: any) => {
      console.error('Profile update failed:', error);
    },
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    queryClient.clear();
    
    // Show success toast
    toast.success('Logged out successfully! 👋');
    
    router.push('/login');
  };

  // Helper functions
  const isAuthenticated = !!user;
  const isLoading = !isInitialized || isUserLoading || loginMutation.isPending || registerMutation.isPending;

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    logout,
    
    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    
    // Errors
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    updateProfileError: updateProfileMutation.error,
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { LoginCredentials, RegisterData, User, AuthResponse } from '@/types/auth';
import { getAuthToken, getUser, setAuthToken, setUserData } from '@/lib/authStorage';
import { toast } from 'react-toastify';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Get current user from localStorage
const getCurrentUser = async (): Promise<User | null> => {  
  try {
    return await getUser();
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

// Custom hook for authentication
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user from localStorage on client side
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setUserData(currentUser)
      setIsInitialized(true);
    }
    fetchUser();
  }, []);

  // Get current user query (only for refreshing data)
  const { data: refreshedUser, isLoading: isUserLoading } = useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        return null;
      }
      
      const token = await getAuthToken();
      if (!token) return null;
      
      try {
        const response = await authAPI.getProfile();
        return response.user || null;
      } catch (error) {
        return null;
      }
    },
    enabled: isInitialized && !!user, // Only run if we have a user, are initialized, and have a token
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
    onSuccess: (response: AuthResponse) => {
      setAuthToken(response.access_token);
      setUser(response.user);
      setUserData(response.user)
      queryClient.setQueryData(authKeys.profile(), response.user);
      
      // Show success toast
      toast.success(`Welcome back, ${response.user.firstName}! 🎉`);
      
      // Redirect based on user role
      const redirectPath = response.user.role === 'admin' ? '/admin/dashboard' : '/books';
      router.push(redirectPath);
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      toast.error(error)
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authAPI.register(userData),
    onSuccess: (response: AuthResponse) => {
      setAuthToken(response.access_token)
      setUser(response.user);
      setUserData(response.user)
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
      setUser(updatedUser);
      setUserData(updatedUser)
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
    setUser(null);
    setAuthToken('')
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

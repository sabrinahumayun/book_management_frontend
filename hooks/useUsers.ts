import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI, UserFilters, CreateUserData, UpdateUserData } from '@/lib/usersApi';
import { authAPI } from '@/lib/api';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
};

// Get all users
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => usersAPI.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get user by ID
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersAPI.getUserById(id),
    enabled: !!id,
  });
}

// Get user statistics
export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => usersAPI.getUserStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Create user mutation
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserData) => usersAPI.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      usersAPI.updateUser(id, data),
    onSuccess: (updatedUser, { id }) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(id), updatedUser);
      
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
}

// Delete user mutation
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersAPI.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
}

// Bulk delete users mutation (Admin only)
export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: number[]) => authAPI.bulkDeleteUsers(userIds),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
}

// Delete user data mutation (Admin only) - Cascade deletion
export function useDeleteUserData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => authAPI.deleteUserData(userId),
    onSuccess: () => {
      // Invalidate and refetch all related data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackAPI } from '@/lib/feedbackApi';
import { Feedback, CreateFeedbackData, UpdateFeedbackData, FeedbackFilters } from '@/types/feedback';

// Query keys
export const feedbackKeys = {
  all: ['feedback'] as const,
  lists: () => [...feedbackKeys.all, 'list'] as const,
  list: (filters: FeedbackFilters) => [...feedbackKeys.lists(), filters] as const,
  details: () => [...feedbackKeys.all, 'detail'] as const,
  detail: (id: number) => [...feedbackKeys.details(), id] as const,
};

// Hook for getting all reviews (public)
export function useAllReviews(filters: FeedbackFilters = {}) {
  return useQuery({
    queryKey: [...feedbackKeys.lists(), 'all-reviews', filters],
    queryFn: () => feedbackAPI.getAllReviews(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for getting current user's reviews
export function useMyReviews(filters: FeedbackFilters = {}) {
  return useQuery({
    queryKey: [...feedbackKeys.lists(), 'my-reviews', filters],
    queryFn: () => feedbackAPI.getMyReviews(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for getting admin reviews
export function useAdminReviews(filters: FeedbackFilters = {}) {
  return useQuery({
    queryKey: [...feedbackKeys.lists(), 'admin-reviews', filters],
    queryFn: () => feedbackAPI.getAdminReviews(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Legacy hook for backward compatibility - now uses all reviews
export function useFeedback(filters: FeedbackFilters = {}) {
  return useAllReviews(filters);
}

// Hook for getting feedback for a specific book
export function useFeedbackByBook(bookId: number, filters: FeedbackFilters = {}) {
  return useQuery({
    queryKey: [...feedbackKeys.lists(), 'book', bookId, filters],
    queryFn: () => feedbackAPI.getFeedbackByBook(bookId, filters),
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for getting a single feedback
export function useFeedbackById(id: number) {
  return useQuery({
    queryKey: feedbackKeys.detail(id),
    queryFn: () => feedbackAPI.getFeedbackById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for creating feedback
export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackData: CreateFeedbackData) => feedbackAPI.createFeedback(feedbackData),
    onSuccess: () => {
      // Invalidate and refetch feedback list
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
  });
}

// Hook for updating feedback
export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFeedbackData }) =>
      feedbackAPI.updateFeedback(id, data),
    onSuccess: (updatedFeedback) => {
      // Update the specific feedback in cache
      queryClient.setQueryData(feedbackKeys.detail(updatedFeedback.id), updatedFeedback);
      // Invalidate and refetch feedback list
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
  });
}

// Hook for moderating feedback (admin)
export function useModerateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, moderationData }: { id: number; moderationData: { moderated: boolean; reason?: string } }) =>
      feedbackAPI.moderateFeedback(id, moderationData),
    onSuccess: (updatedFeedback) => {
      // Update the specific feedback in cache
      queryClient.setQueryData(feedbackKeys.detail(updatedFeedback.id), updatedFeedback);
      // Invalidate and refetch feedback lists
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
  });
}

// Hook for deleting feedback
export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => feedbackAPI.deleteFeedback(id),
    onSuccess: (_, deletedId) => {
      // Remove the feedback from cache
      queryClient.removeQueries({ queryKey: feedbackKeys.detail(deletedId) });
      // Invalidate and refetch feedback list
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
  });
}

// Hook for bulk deleting feedback
export function useBulkDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackIds: number[]) => feedbackAPI.bulkDeleteFeedback(feedbackIds),
    onSuccess: () => {
      // Invalidate and refetch feedback list
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
  });
}

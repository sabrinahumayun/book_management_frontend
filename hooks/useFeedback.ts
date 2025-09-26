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

// Hook for getting feedback with filters
export function useFeedback(filters: FeedbackFilters = {}) {
  return useQuery({
    queryKey: feedbackKeys.list(filters),
    queryFn: () => feedbackAPI.getFeedback(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
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

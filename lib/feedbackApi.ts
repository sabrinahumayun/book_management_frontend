import api from './api';
import { Feedback, FeedbackResponse, CreateFeedbackData, UpdateFeedbackData, FeedbackFilters } from '@/types/feedback';

export const feedbackAPI = {
  // Get all feedback with pagination and filters
  getFeedback: async (filters: FeedbackFilters = {}): Promise<FeedbackResponse> => {
    const params = new URLSearchParams();
    
    if (filters.bookId) params.append('bookId', filters.bookId.toString());
    if (filters.userId) params.append('userId', filters.userId.toString());
    if (filters.rating) params.append('rating', filters.rating.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/feedback?${params.toString()}`);
    return response.data;
  },

  // Get feedback by ID
  getFeedbackById: async (id: number): Promise<Feedback> => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  // Create new feedback
  createFeedback: async (feedbackData: CreateFeedbackData): Promise<Feedback> => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  // Update feedback
  updateFeedback: async (id: number, feedbackData: UpdateFeedbackData): Promise<Feedback> => {
    const response = await api.put(`/feedback/${id}`, feedbackData);
    return response.data;
  },

  // Delete feedback
  deleteFeedback: async (id: number): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },
};

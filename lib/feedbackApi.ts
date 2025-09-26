import api from './api';
import { Feedback, FeedbackResponse, CreateFeedbackData, UpdateFeedbackData, FeedbackFilters } from '@/types/feedback';

export const feedbackAPI = {
  // Get all feedback with pagination and filters (Public endpoint)
  getFeedback: async (filters: FeedbackFilters = {}): Promise<FeedbackResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/feedback?${params.toString()}`);
    return response.data;
  },

  // Get feedback for specific book (Public endpoint)
  getFeedbackByBook: async (bookId: number, filters: FeedbackFilters = {}): Promise<FeedbackResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/feedback/book/${bookId}?${params.toString()}`);
    return response.data;
  },

  // Get feedback by ID (Requires authentication)
  getFeedbackById: async (id: number): Promise<Feedback> => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  // Create new feedback (Requires authentication)
  createFeedback: async (feedbackData: CreateFeedbackData): Promise<Feedback> => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  // Update feedback (Requires authentication)
  updateFeedback: async (id: number, feedbackData: UpdateFeedbackData): Promise<Feedback> => {
    const response = await api.put(`/feedback/${id}`, feedbackData);
    return response.data;
  },

  // Delete feedback (Requires authentication)
  deleteFeedback: async (id: number): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },
};

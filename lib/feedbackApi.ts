import api from './api';
import { Feedback, FeedbackResponse, CreateFeedbackData, UpdateFeedbackData, FeedbackFilters } from '@/types/feedback';

export const feedbackAPI = {
  // Get all reviews (public endpoint)
  getAllReviews: async (filters: FeedbackFilters = {}): Promise<FeedbackResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/feedback/all-reviews?${params.toString()}`);
    return response.data;
  },

  // Get current user's reviews
  getMyReviews: async (filters: FeedbackFilters = {}): Promise<FeedbackResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/feedback/my-reviews?${params.toString()}`);
    return response.data;
  },

  // Get all reviews (admin only)
  getAdminReviews: async (filters: FeedbackFilters = {}): Promise<FeedbackResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/feedback/admin?${params.toString()}`);
    return response.data;
  },

  // Get reviews for specific book
  getFeedbackByBook: async (bookId: number, filters: FeedbackFilters = {}): Promise<FeedbackResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/feedback/book/${bookId}?${params.toString()}`);
    return response.data;
  },

  // Get specific review
  getFeedbackById: async (id: number): Promise<Feedback> => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  // Create new review
  createFeedback: async (feedbackData: CreateFeedbackData): Promise<Feedback> => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  // Moderate review (admin)
  moderateFeedback: async (id: number, moderationData: { moderated: boolean; reason?: string }): Promise<Feedback> => {
    const response = await api.patch(`/feedback/${id}/moderate`, moderationData);
    return response.data;
  },

  // Update feedback (Requires authentication)
  updateFeedback: async (id: number, feedbackData: UpdateFeedbackData): Promise<Feedback> => {
    const response = await api.put(`/feedback/${id}`, feedbackData);
    return response.data;
  },

  // Delete review
  deleteFeedback: async (id: number): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },
};

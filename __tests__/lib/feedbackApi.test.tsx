import { feedbackAPI } from '@/lib/feedbackApi';
import api from '@/lib/api';
import { CreateFeedbackData, UpdateFeedbackData } from '@/types/feedback';

// Mock the API client
jest.mock('@/lib/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('feedbackAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllReviews', () => {
    it('should call API with correct parameters', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const filters = { page: 1, limit: 10 };
      await feedbackAPI.getAllReviews(filters);

      expect(mockApi.get).toHaveBeenCalledWith('/feedback/all-reviews?page=1&limit=10');
    });

    it('should handle search parameter', async () => {
      const mockResponse = { data: [] };
      mockApi.get.mockResolvedValue({ data: mockResponse });

      const filters = { page: 1, limit: 10, search: 'test' };
      await feedbackAPI.getAllReviews(filters);

      expect(mockApi.get).toHaveBeenCalledWith('/feedback/all-reviews?page=1&limit=10&search=test');
    });
  });

  describe('getMyReviews', () => {
    it('should call API with correct parameters', async () => {
      const mockResponse = { data: [] };
      mockApi.get.mockResolvedValue({ data: mockResponse });

      const filters = { page: 1, limit: 10 };
      await feedbackAPI.getMyReviews(filters);

      expect(mockApi.get).toHaveBeenCalledWith('/feedback/my-reviews?page=1&limit=10');
    });
  });

  describe('getAdminReviews', () => {
    it('should call API with correct parameters', async () => {
      const mockResponse = { data: [] };
      mockApi.get.mockResolvedValue({ data: mockResponse });

      const filters = { page: 1, limit: 10, search: 'test' };
      await feedbackAPI.getAdminReviews(filters);

      expect(mockApi.get).toHaveBeenCalledWith('/feedback/admin?page=1&limit=10&search=test');
    });
  });

  describe('getFeedbackByBook', () => {
    it('should call API with correct book ID and parameters', async () => {
      const mockResponse = { data: [] };
      mockApi.get.mockResolvedValue({ data: mockResponse });

      const bookId = 1;
      const filters = { page: 1, limit: 10 };
      await feedbackAPI.getFeedbackByBook(bookId, filters);

      expect(mockApi.get).toHaveBeenCalledWith('/feedback/book/1?page=1&limit=10');
    });
  });

  describe('getFeedbackById', () => {
    it('should call API with correct feedback ID', async () => {
      const mockResponse = { id: 1, rating: 5, comment: 'Great!' };
      mockApi.get.mockResolvedValue({ data: mockResponse });

      const feedbackId = 1;
      await feedbackAPI.getFeedbackById(feedbackId);

      expect(mockApi.get).toHaveBeenCalledWith('/feedback/1');
    });
  });

  describe('createFeedback', () => {
    it('should call API with correct feedback data', async () => {
      const mockResponse = { id: 1, rating: 5, comment: 'Great!', bookId: 1 };
      mockApi.post.mockResolvedValue({ data: mockResponse });

      const feedbackData: CreateFeedbackData = {
        rating: 5,
        comment: 'Great book!',
        bookId: 1,
      };

      await feedbackAPI.createFeedback(feedbackData);

      expect(mockApi.post).toHaveBeenCalledWith('/feedback', feedbackData);
    });
  });

  describe('moderateFeedback', () => {
    it('should call API with correct moderation data', async () => {
      const mockResponse = { id: 1, moderated: true };
      mockApi.patch.mockResolvedValue({ data: mockResponse });

      const feedbackId = 1;
      const moderationData = { moderated: true, reason: 'Inappropriate content' };

      await feedbackAPI.moderateFeedback(feedbackId, moderationData);

      expect(mockApi.patch).toHaveBeenCalledWith('/feedback/1/moderate', moderationData);
    });
  });

  describe('updateFeedback', () => {
    it('should call API with correct update data', async () => {
      const mockResponse = { id: 1, rating: 4, comment: 'Updated comment' };
      mockApi.patch.mockResolvedValue({ data: mockResponse });

      const feedbackId = 1;
      const updateData: UpdateFeedbackData = {
        rating: 4,
        comment: 'Updated comment',
      };

      await feedbackAPI.updateFeedback(feedbackId, updateData);

      expect(mockApi.patch).toHaveBeenCalledWith('/feedback/1', updateData);
    });
  });

  describe('deleteFeedback', () => {
    it('should call API with correct feedback ID', async () => {
      mockApi.delete.mockResolvedValue({});

      const feedbackId = 1;
      await feedbackAPI.deleteFeedback(feedbackId);

      expect(mockApi.delete).toHaveBeenCalledWith('/feedback/1');
    });
  });

  describe('bulkDeleteFeedback', () => {
    it('should call API with correct feedback IDs', async () => {
      mockApi.delete.mockResolvedValue({});

      const feedbackIds = [1, 2, 3];
      await feedbackAPI.bulkDeleteFeedback(feedbackIds);

      expect(mockApi.delete).toHaveBeenCalledWith('/feedback/bulk', {
        data: { feedbackIds },
      });
    });
  });
});

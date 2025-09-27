import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateFeedback } from '@/hooks/useFeedback';
import { feedbackAPI } from '@/lib/feedbackApi';
import { CreateFeedbackData } from '@/types/feedback';
import React from 'react';

// Mock the API
jest.mock('@/lib/feedbackApi', () => ({
  feedbackAPI: {
    createFeedback: jest.fn(),
  },
}));

const mockFeedbackAPI = feedbackAPI as jest.Mocked<typeof feedbackAPI>;

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useCreateFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state correctly', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateFeedback(), { wrapper });

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('should call API with correct data when mutate is called', async () => {
    const mockFeedback = {
      id: 1,
      rating: 5,
      comment: 'Great book!',
      bookId: 1,
      userId: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      user: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      book: {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
      },
    };

    mockFeedbackAPI.createFeedback.mockResolvedValue(mockFeedback);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateFeedback(), { wrapper });

    const feedbackData: CreateFeedbackData = {
      rating: 5,
      comment: 'Great book!',
      bookId: 1,
    };

    result.current.mutate(feedbackData);

    await waitFor(() => {
      expect(mockFeedbackAPI.createFeedback).toHaveBeenCalledWith(feedbackData);
    });
  });

  it('should handle API errors correctly', async () => {
    const mockError = new Error('API Error');
    mockFeedbackAPI.createFeedback.mockRejectedValue(mockError);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateFeedback(), { wrapper });

    const feedbackData: CreateFeedbackData = {
      rating: 5,
      comment: 'Great book!',
      bookId: 1,
    };

    result.current.mutate(feedbackData);

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('should set isPending to true during mutation', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockFeedbackAPI.createFeedback.mockReturnValue(promise as any);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateFeedback(), { wrapper });

    const feedbackData: CreateFeedbackData = {
      rating: 5,
      comment: 'Great book!',
      bookId: 1,
    };

    // Start the mutation
    result.current.mutate(feedbackData);

    // Wait for the mutation to start
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Resolve the promise
    resolvePromise!({ id: 1, rating: 5, comment: 'Great book!', bookId: 1 });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });

  it('should reset error state when reset is called', async () => {
    const mockError = new Error('API Error');
    mockFeedbackAPI.createFeedback.mockRejectedValue(mockError);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateFeedback(), { wrapper });

    const feedbackData: CreateFeedbackData = {
      rating: 5,
      comment: 'Great book!',
      bookId: 1,
    };

    result.current.mutate(feedbackData);

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    // Reset the error
    result.current.reset();

    // Wait for the reset to take effect
    await waitFor(() => {
      expect(result.current.error).toBe(null);
    });
  });
});

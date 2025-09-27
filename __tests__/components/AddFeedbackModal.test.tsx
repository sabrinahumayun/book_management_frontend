import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import AddFeedbackModal from '@/components/AddFeedbackModal';
import { useCreateFeedback } from '@/hooks/useFeedback';
import { Book } from '@/types/books';

// Mock the hooks
jest.mock('@/hooks/useFeedback', () => ({
  useCreateFeedback: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: any) => (e: any) => {
      e.preventDefault();
      fn({ rating: 5, comment: 'Test comment' });
    },
    reset: jest.fn(),
    formState: { errors: {} },
  }),
  Controller: ({ render: renderProp }: any) => renderProp({ field: { value: 5, onChange: jest.fn() } }),
}));

const mockUseCreateFeedback = useCreateFeedback as jest.MockedFunction<typeof useCreateFeedback>;

// Test theme
const theme = createTheme();

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Mock book data
const mockBook: Book = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  isbn: '1234567890',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  createdBy: 1,
  creator: {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  },
  coverImageUrl: 'https://example.com/cover.jpg',
  description: 'Test description',
};

describe('AddFeedbackModal', () => {
  const mockOnClose = jest.fn();
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementation
    mockUseCreateFeedback.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      reset: jest.fn(),
    } as any);
  });

  describe('Rendering', () => {
    it('should render the modal when open is true', () => {
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      expect(screen.getByText('Rate & Review Book')).toBeInTheDocument();
      expect(screen.getByText('Test Book')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });

    it('should not render the modal when open is false', () => {
      render(
        <TestWrapper>
          <AddFeedbackModal open={false} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      expect(screen.queryByText('Rate & Review Book')).not.toBeInTheDocument();
    });

    it('should not render when book is null', () => {
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={null} />
        </TestWrapper>
      );

      expect(screen.queryByText('Rate & Review Book')).not.toBeInTheDocument();
    });
  });

  describe('Book Information Display', () => {
    it('should display book title correctly', () => {
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    it('should display book author correctly', () => {
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });

    it('should display book ISBN correctly', () => {
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call mutate with correct data when form is submitted', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit Review');
      await user.click(submitButton);

      expect(mockMutate).toHaveBeenCalledWith(
        {
          rating: 5,
          comment: 'Test comment',
          bookId: 1,
        },
        expect.any(Object)
      );
    });

    it('should not call mutate when book is null', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={null} />
        </TestWrapper>
      );

      // Modal should not render when book is null
      expect(screen.queryByText('Submit Review')).not.toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should validate book ID before submission', async () => {
      const user = userEvent.setup();
      const invalidBook = { ...mockBook, id: NaN };
      
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={invalidBook} />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit Review');
      await user.click(submitButton);

      expect(mockMutate).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Invalid book ID. Please refresh the page and try again.');
    });
  });

  describe('Success Handling', () => {
    it('should show success toast and close modal on successful submission', async () => {
      const user = userEvent.setup();
      
      // Mock successful mutation
      mockMutate.mockImplementation((data, { onSuccess }) => {
        onSuccess();
      });

      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit Review');
      await user.click(submitButton);

      expect(toast.success).toHaveBeenCalledWith('Feedback submitted successfully! ⭐');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should show error toast on mutation error', async () => {
      const user = userEvent.setup();
      const mockError = {
        response: {
          data: {
            message: 'Test error message'
          }
        }
      };

      // Mock error mutation
      mockMutate.mockImplementation((data, { onError }) => {
        onError(mockError);
      });

      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit Review');
      await user.click(submitButton);

      expect(toast.error).toHaveBeenCalledWith('Test error message');
    });

    it('should handle 409 conflict error correctly', async () => {
      const user = userEvent.setup();
      const conflictError = {
        response: {
          status: 409,
          data: {
            message: 'You have already left feedback for this book'
          }
        }
      };

      mockMutate.mockImplementation((data, { onError }) => {
        onError(conflictError);
      });

      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit Review');
      await user.click(submitButton);

      expect(toast.error).toHaveBeenCalledWith('You have already left feedback for this book');
    });

    it('should handle 429 rate limit error correctly', async () => {
      const user = userEvent.setup();
      const rateLimitError = {
        response: {
          status: 429,
          data: {
            message: 'Too Many Requests - Rate limit exceeded (1 feedback per minute per user)'
          }
        }
      };

      mockMutate.mockImplementation((data, { onError }) => {
        onError(rateLimitError);
      });

      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit Review');
      await user.click(submitButton);

      expect(toast.error).toHaveBeenCalledWith('Too Many Requests - Rate limit exceeded (1 feedback per minute per user)');
    });
  });

  describe('Loading States', () => {
    it('should show loading state when mutation is pending', () => {
      mockUseCreateFeedback.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        error: null,
        reset: jest.fn(),
      } as any);

      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      expect(screen.getByText('Submitting...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
    });

    it('should disable cancel button when mutation is pending', () => {
      mockUseCreateFeedback.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        error: null,
        reset: jest.fn(),
      } as any);

      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });
  });

  describe('Modal Actions', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset form when modal is closed', async () => {
      const user = userEvent.setup();
      const mockReset = jest.fn();
      
      // Mock useForm to return reset function
      jest.doMock('react-hook-form', () => ({
        useForm: () => ({
          control: {},
          handleSubmit: (fn: any) => (e: any) => fn({ rating: 5, comment: 'Test comment' }),
          reset: mockReset,
          formState: { errors: {} },
        }),
        Controller: ({ render: renderProp }: any) => renderProp({ field: { value: 5, onChange: jest.fn() } }),
      }));

      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Rate & Review Book')).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={mockBook} />
        </TestWrapper>
      );

      // Tab navigation should work
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle book with missing cover image', () => {
      const bookWithoutCover = { ...mockBook, coverImageUrl: null };
      
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={bookWithoutCover} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Book')).toBeInTheDocument();
      // Should still render without errors
    });

    it('should handle book with missing description', () => {
      const bookWithoutDescription = { ...mockBook, description: null };
      
      render(
        <TestWrapper>
          <AddFeedbackModal open={true} onClose={mockOnClose} book={bookWithoutDescription} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Book')).toBeInTheDocument();
      // Should still render without errors
    });
  });
});

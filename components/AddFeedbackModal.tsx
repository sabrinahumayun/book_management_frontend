'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  AlertTitle,
  Rating,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useCreateFeedback } from '@/hooks/useFeedback';
import { CreateFeedbackData } from '@/types/feedback';
import { Book } from '@/types/books';

interface AddFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  book: Book | null;
}

interface FeedbackFormData {
  rating: number;
  comment: string;
}

export default function AddFeedbackModal({ open, onClose, book }: AddFeedbackModalProps) {
  const createFeedbackMutation = useCreateFeedback();
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  const handleClose = () => {
    reset();
    setShowSuccessMessage(false);
    onClose();
  };

  const onSubmit = (data: FeedbackFormData) => {
    if (!book) return;
    
    const feedbackData: CreateFeedbackData = {
      rating: Math.round(data.rating), // Ensure rating is an integer
      comment: data.comment,
      bookId: book.id,
    };

    createFeedbackMutation.mutate(feedbackData, {
      onSuccess: () => {
        setShowSuccessMessage(true);
        setTimeout(() => {
          handleClose();
          setShowSuccessMessage(false);
        }, 1500); // Show success message for 1.5 seconds before closing
      },
    });
  };

  // Clear error when user starts typing
  const handleFieldChange = () => {
    if (createFeedbackMutation.error) {
      createFeedbackMutation.reset();
    }
  };

  // Helper function to get error message
  const getErrorMessage = () => {
    if (!createFeedbackMutation.error) return null;
    
    const error = createFeedbackMutation.error as any;
    
    // Debug: Log the full error structure to help identify the actual message
    console.log('Full error object:', error);
    console.log('Error response:', error?.response);
    console.log('Error response data:', error?.response?.data);
    
    // Always try to get the actual error message from backend first
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    // If no specific message, try to get from error message
    if (error?.message) {
      return error.message;
    }
    
    // Handle validation errors from backend
    if (error?.response?.status === 400) {
      const errorData = error.response.data;
      
      // If it's an array of validation errors
      if (Array.isArray(errorData?.errors)) {
        return errorData.errors.map((err: any) => err.message || err).join(', ');
      }
      
      // Generic 400 error
      return errorData?.message || 'Please check your input and try again.';
    }
    
    // Handle authentication errors
    if (error?.response?.status === 401) {
      return error?.response?.data?.message || 'You are not authorized to perform this action. Please log in again.';
    }
    
    // Handle forbidden errors
    if (error?.response?.status === 403) {
      return error?.response?.data?.message || 'You do not have permission to create feedback.';
    }
    
    // Handle conflict errors (e.g., duplicate feedback)
    if (error?.response?.status === 409) {
      return error?.response?.data?.message || 'You have already provided feedback for this book. You can only provide one feedback per book.';
    }
    
    // Handle server errors - show actual backend message
    if (error?.response?.status >= 500) {
      return error?.response?.data?.message || 'Server error occurred. Please try again later.';
    }
    
    // Handle network errors
    if (error?.code === 'NETWORK_ERROR' || !error?.response) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    // Default error message
    return 'Failed to create feedback. Please try again.';
  };

  if (!book) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600,
          fontSize: '1.25rem',
          py: 3,
        }}
      >
        Rate & Review Book
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Book Info */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(0,0,0,0.02)', 
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.08)'
            }}>
              <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Author:</strong> {book.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>ISBN:</strong> {book.isbn}
              </Typography>
            </Box>

            {createFeedbackMutation.error && (
              <Alert 
                severity="error"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                  }
                }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => createFeedbackMutation.reset()}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    Dismiss
                  </Button>
                }
              >
                <AlertTitle sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  Error Creating Feedback
                </AlertTitle>
                {getErrorMessage()}
              </Alert>
            )}
            
            {showSuccessMessage && (
              <Alert 
                severity="success"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                  }
                }}
              >
                Feedback submitted successfully! ⭐
              </Alert>
            )}
            
            {/* Rating */}
            <Box>
              <Typography variant="subtitle1" fontWeight="600" color="text.primary" gutterBottom>
                Rating *
              </Typography>
              <Controller
                name="rating"
                control={control}
                rules={{
                  required: 'Rating is required',
                  min: {
                    value: 1,
                    message: 'Rating must be at least 1 star',
                  },
                  max: {
                    value: 5,
                    message: 'Rating must be at most 5 stars',
                  },
                  validate: (value) => {
                    if (!Number.isInteger(value)) {
                      return 'Rating must be a whole number';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating
                      {...field}
                      size="large"
                      precision={1}
                      onChange={(e, newValue) => {
                        field.onChange(newValue);
                        handleFieldChange();
                      }}
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#ffc107',
                        },
                        '& .MuiRating-iconHover': {
                          color: '#ffc107',
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {field.value} star{field.value !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
              />
              {errors.rating && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.rating.message}
                </Typography>
              )}
            </Box>
            
            {/* Comment */}
            <Controller
              name="comment"
              control={control}
              rules={{
                required: 'Comment is required',
                minLength: {
                  value: 10,
                  message: 'Comment must be at least 10 characters',
                },
                maxLength: {
                  value: 500,
                  message: 'Comment must be less than 500 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Review"
                  placeholder="Share your thoughts about this book..."
                  error={!!errors.comment}
                  helperText={errors.comment?.message || `${field.value?.length || 0}/500 characters`}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange();
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: 'text.secondary',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'text.primary',
                backgroundColor: 'rgba(0,0,0,0.04)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createFeedbackMutation.isPending}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              },
              '&:disabled': {
                background: 'rgba(0,0,0,0.12)',
                boxShadow: 'none',
              }
            }}
          >
            {createFeedbackMutation.isPending ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Submitting...
              </Box>
            ) : (
              'Submit Review'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

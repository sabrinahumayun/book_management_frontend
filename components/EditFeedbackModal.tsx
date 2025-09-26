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
  CircularProgress,
  Rating,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateFeedback } from '@/hooks/useFeedback';
import { UpdateFeedbackData, Feedback } from '@/types/feedback';
import { toast } from 'react-toastify';

interface EditFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  feedback: Feedback | null;
}

interface FeedbackFormData {
  rating: number;
  comment: string;
}

export default function EditFeedbackModal({ open, onClose, feedback }: EditFeedbackModalProps) {
  const updateFeedbackMutation = useUpdateFeedback();

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

  // Reset form when feedback changes
  React.useEffect(() => {
    if (feedback) {
      reset({
        rating: feedback.rating,
        comment: feedback.comment,
      });
    }
  }, [feedback, reset]);

  const handleClose = () => {
    reset();
    updateFeedbackMutation.reset();
    onClose();
  };

  const onSubmit = (data: FeedbackFormData) => {
    if (!feedback) return;
    
    const updateData: UpdateFeedbackData = {
      rating: Math.round(data.rating), // Ensure rating is an integer
      comment: data.comment,
    };

    updateFeedbackMutation.mutate(
      { id: feedback.id, data: updateData },
      {
        onSuccess: () => {
          toast.success('Review updated successfully! ✨');
          handleClose();
        },
        onError: (error: any) => {
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage || 'Failed to update review. Please try again.');
        },
      }
    );
  };

  // Clear error when user starts typing
  const handleFieldChange = () => {
    if (updateFeedbackMutation.error) {
      updateFeedbackMutation.reset();
    }
  };

  // Helper function to get error message
  const getErrorMessage = (error: any) => {
    if (!error) return null;
    
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
      return error?.response?.data?.message || 'You do not have permission to edit this feedback.';
    }
    
    // Handle not found errors
    if (error?.response?.status === 404) {
      return error?.response?.data?.message || 'Feedback not found. It may have been deleted.';
    }
    
    // Handle rate limit errors (429)
    if (error?.response?.status === 429) {
      return error?.response?.data?.message || 'Too many requests. Please wait a moment before updating feedback again.';
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
    return 'Failed to update feedback. Please try again.';
  };

  if (!feedback) return null;

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
        Edit Review
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
                {feedback.book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Author:</strong> {feedback.book.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>ISBN:</strong> {feedback.book.isbn}
              </Typography>
            </Box>

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
            disabled={updateFeedbackMutation.isPending}
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
            {updateFeedbackMutation.isPending ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Updating...
              </Box>
            ) : (
              'Update Review'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useCreateBook } from '@/hooks/useBooks';
import { CreateBookData } from '@/types/books';
import { toast } from 'react-toastify';

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
}

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
}

export default function AddBookModal({ open, onClose }: AddBookModalProps) {
  const createBookMutation = useCreateBook();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
    },
  });

  const handleClose = () => {
    reset();
    createBookMutation.reset();
    onClose();
  };

  const onSubmit = (data: BookFormData) => {
    createBookMutation.mutate(data as CreateBookData, {
      onSuccess: () => {
        toast.success('Book created successfully! 🎉');
        handleClose();
      },
      onError: (error: any) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      },
    });
  };

  // Clear error when user starts typing
  const handleFieldChange = () => {
    if (createBookMutation.error) {
      createBookMutation.reset();
    }
  };

  // Helper function to get error message
  const getErrorMessage = (error: any) => {
    if (!error) return 'An unexpected error occurred';
    
    // Handle validation errors from backend
    if (error?.response?.status === 400) {
      const errorData = error.response.data;
      
      // If it's a validation error with field-specific messages
      if (errorData?.message && typeof errorData.message === 'string') {
        return errorData.message;
      }
      
      // If it's an array of validation errors
      if (Array.isArray(errorData?.errors)) {
        return errorData.errors.map((err: any) => err.message || err).join(', ');
      }
      
      // Generic 400 error
      return errorData?.message || 'Please check your input and try again.';
    }
    
    // Handle authentication errors
    if (error?.response?.status === 401) {
      return 'You are not authorized to perform this action. Please log in again.';
    }
    
    // Handle forbidden errors
    if (error?.response?.status === 403) {
      return 'You do not have permission to create books.';
    }
    
    // Handle conflict errors (e.g., duplicate ISBN)
    if (error?.response?.status === 409) {
      return 'A book with this ISBN already exists. Please use a different ISBN.';
    }
    
    // Handle server errors
    if (error?.response?.status >= 500) {
      return 'Server error occurred. Please try again later.';
    }
    
    // Handle network errors
    if (error?.code === 'NETWORK_ERROR' || !error?.response) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    // Default error message
    return 'Failed to create book. Please try again.';
  };

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
        Add New Book
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <Controller
              name="title"
              control={control}
              rules={{
                required: 'Title is required',
                minLength: {
                  value: 2,
                  message: 'Title must be at least 2 characters',
                },
                maxLength: {
                  value: 200,
                  message: 'Title must be less than 200 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Book Title"
                  placeholder="Enter the book title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
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
            
            <Controller
              name="author"
              control={control}
              rules={{
                required: 'Author is required',
                minLength: {
                  value: 2,
                  message: 'Author must be at least 2 characters',
                },
                maxLength: {
                  value: 100,
                  message: 'Author must be less than 100 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Author"
                  placeholder="Enter the author's name"
                  error={!!errors.author}
                  helperText={errors.author?.message}
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
            
            <Controller
              name="isbn"
              control={control}
              rules={{
                required: 'ISBN is required',
                pattern: {
                  value: /^[\d-]+$/,
                  message: 'ISBN must contain only numbers and hyphens',
                },
                minLength: {
                  value: 10,
                  message: 'ISBN must be at least 10 characters',
                },
                maxLength: {
                  value: 17,
                  message: 'ISBN must be less than 17 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="ISBN"
                  placeholder="Enter the ISBN (e.g., 978-0-123456-78-9)"
                  error={!!errors.isbn}
                  helperText={errors.isbn?.message || 'Enter the ISBN number with or without hyphens'}
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
            disabled={createBookMutation.isPending}
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
            {createBookMutation.isPending ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Creating...
              </Box>
            ) : (
              'Add Book'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

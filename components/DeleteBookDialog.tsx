'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  CircularProgress,
  AlertTitle,
  Typography,
} from '@mui/material';
import { useDeleteBook } from '@/hooks/useBooks';
import { Book } from '@/types/books';

interface DeleteBookDialogProps {
  open: boolean;
  onClose: () => void;
  book: Book | null;
}

export default function DeleteBookDialog({ open, onClose, book }: DeleteBookDialogProps) {
  const deleteBookMutation = useDeleteBook();
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  const handleClose = () => {
    setShowSuccessMessage(false);
    onClose();
  };

  const handleDelete = () => {
    if (!book) return;
    
    deleteBookMutation.mutate(book.id, {
      onSuccess: () => {
        setShowSuccessMessage(true);
        setTimeout(() => {
          handleClose();
          setShowSuccessMessage(false);
        }, 1500); // Show success message for 1.5 seconds before closing
      },
    });
  };

  // Helper function to get error message
  const getErrorMessage = () => {
    if (!deleteBookMutation.error) return null;
    
    const error = deleteBookMutation.error as any;
    
    // Handle authentication errors
    if (error?.response?.status === 401) {
      return 'You are not authorized to perform this action. Please log in again.';
    }
    
    // Handle forbidden errors
    if (error?.response?.status === 403) {
      return 'You do not have permission to delete this book.';
    }
    
    // Handle not found errors
    if (error?.response?.status === 404) {
      return 'Book not found. It may have already been deleted.';
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
    return 'Failed to delete book. Please try again.';
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
          background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
          color: 'white',
          fontWeight: 600,
          fontSize: '1.25rem',
          py: 3,
        }}
      >
        Delete Book
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {deleteBookMutation.error && (
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
                  onClick={() => deleteBookMutation.reset()}
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
                Error Deleting Book
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
              Book deleted successfully! 🗑️
            </Alert>
          )}
          
          <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            Are you sure you want to delete this book? This action cannot be undone.
          </Typography>
          
          <Box 
            sx={{ 
              p: 3, 
              backgroundColor: 'rgba(0,0,0,0.02)', 
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Author:</strong> {book.author}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>ISBN:</strong> {book.isbn}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Created:</strong> {new Date(book.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
            ⚠️ This will permanently remove the book from your collection and cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          disabled={deleteBookMutation.isPending}
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
          onClick={handleDelete}
          variant="contained"
          disabled={deleteBookMutation.isPending}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
            boxShadow: '0 4px 15px rgba(245, 101, 101, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
              boxShadow: '0 6px 20px rgba(245, 101, 101, 0.6)',
            },
            '&:disabled': {
              background: 'rgba(0,0,0,0.12)',
              boxShadow: 'none',
            }
          }}
        >
          {deleteBookMutation.isPending ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Deleting...
            </Box>
          ) : (
            'Delete Book'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

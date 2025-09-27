'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Pagination,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person,
} from '@mui/icons-material';
import { useFeedbackByBook, useDeleteFeedback } from '@/hooks/useFeedback';
import { Feedback } from '@/types/feedback';
import { useAuth } from '@/hooks/useAuth';

interface FeedbackListProps {
  bookId: number;
  onEditFeedback?: (feedback: Feedback) => void;
}

export default function FeedbackList({ bookId, onEditFeedback }: FeedbackListProps) {
  const { user } = useAuth();
  const [page, setPage] = React.useState(1);
  const limit = 5;

  const { data: feedbackResponse, isLoading, error } = useFeedbackByBook(bookId, {
    page,
    limit,
  });

  const deleteFeedbackMutation = useDeleteFeedback();

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteFeedback = (feedbackId: number) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      deleteFeedbackMutation.mutate(feedbackId);
    }
  };

  const feedbacks = feedbackResponse?.data || [];
  const totalPages = feedbackResponse?.totalPages || 0;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load feedback. Please try again.
      </Alert>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No reviews yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Be the first to review this book!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Feedback Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
          Reviews & Ratings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {feedbackResponse?.total || 0} review{feedbackResponse?.total !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Feedback List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {feedbacks.map((feedback) => (
          <Card
            key={feedback.id}
            sx={{
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* User Info & Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                      {feedback.user.firstName} {feedback.user.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating
                    value={feedback.rating}
                    readOnly
                    size="small"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#ffc107',
                      },
                    }}
                  />
                  <Chip
                    label={`${feedback.rating}/5`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Comment */}
              <Typography variant="body1" color="text.primary" sx={{ mb: 2, lineHeight: 1.6 }}>
                {feedback.comment}
              </Typography>

              {/* Actions (only for own feedback) */}
              {user?.id === feedback.userId && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {onEditFeedback && (
                      <Tooltip title="Edit Review">
                        <IconButton
                          size="small"
                          onClick={() => onEditFeedback(feedback)}
                          color="primary"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete Review">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteFeedback(feedback.id)}
                        color="error"
                        disabled={deleteFeedbackMutation.isPending}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
}

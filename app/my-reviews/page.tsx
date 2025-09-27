'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Rating,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Pagination,
} from '@mui/material';
import {
  LibraryBooks,
  Person,
  CalendarToday,
  Star,
  RateReview,
  Edit,
  ArrowBack,
} from '@mui/icons-material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { useMyReviews, useDeleteFeedback } from '@/hooks/useFeedback';
import { useAuth } from '@/hooks/useAuth';
import EditFeedbackModal from '@/components/EditFeedbackModal';
import DeleteReviewDialog from '@/components/DeleteReviewDialog';
import { Feedback } from '@/types/feedback';

export default function MyReviewsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const limit = 10;

  const { data: feedbackResponse, isLoading, error } = useMyReviews({
    page,
    limit,
  });

  const deleteFeedbackMutation = useDeleteFeedback();

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleEditFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleDeleteFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedFeedback(null);
  };

  const feedbacks = feedbackResponse?.data || [];
  const totalPages = feedbackResponse?.totalPages || 0;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <Box sx={{ minHeight: '100vh', bgcolor: (theme) => theme.palette.background.default }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Alert severity="error">
                Failed to load your feedback. Please try again.
              </Alert>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => router.back()}
                sx={{ mt: 2 }}
              >
                Go Back
              </Button>
            </Container>
          </Box>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ flexGrow: 1, bgcolor: (theme) => theme.palette.background.default, minHeight: '100vh' }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    fontWeight="800" 
                    gutterBottom
                    sx={{ 
                      background: (theme) => theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, #8fa4f3 0%, #9c7bb8 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    My Feedback
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                    Manage your book feedback and ratings
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => router.back()}
                  sx={{ 
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Go Back
                </Button>
              </Box>
            </Box>

            {/* Feedback List */}
            {feedbacks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: (theme) => theme.palette.mode === 'dark' 
                      ? 'linear-gradient(135deg, #8fa4f3 0%, #9c7bb8 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                      ? '0 8px 32px rgba(143, 164, 243, 0.4)'
                      : '0 8px 32px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <RateReview sx={{ fontSize: 48, color: 'white' }} />
                </Box>
                <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                  No feedback yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                  You haven't provided feedback on any books yet. Start exploring books and share your thoughts!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<LibraryBooks />}
                  onClick={() => router.push('/books')}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    background: (theme) => theme.palette.mode === 'dark' 
                      ? 'linear-gradient(135deg, #8fa4f3 0%, #9c7bb8 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                      ? '0 4px 15px rgba(143, 164, 243, 0.4)'
                      : '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: (theme) => theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, #7c94f1 0%, #8a6bb5 100%)'
                        : 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: (theme) => theme.palette.mode === 'dark' 
                        ? '0 6px 20px rgba(143, 164, 243, 0.6)'
                        : '0 6px 20px rgba(102, 126, 234, 0.6)',
                    }
                  }}
                >
                  Browse Books
                </Button>
              </Box>
            ) : (
              <>
                {/* Feedback Count */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                    {feedbackResponse?.total || 0} Feedback{feedbackResponse?.total !== 1 ? 's' : ''}
                  </Typography>
                </Box>

                {/* Feedback Grid */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(2, 1fr)',
                  },
                  gap: 3,
                  mb: 4
                }}>
                  {feedbacks.map((feedback) => (
                    <Card
                      key={feedback.id}
                      sx={{
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        {/* Book Info */}
                        <Box sx={{ mb: 3 }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Rating
                            value={feedback.rating}
                            readOnly
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: (theme) => theme.palette.mode === 'dark' ? '#ffd700' : '#ffc107',
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

                        {/* Comment */}
                        <Typography variant="body2" color="text.primary" sx={{ mb: 3, lineHeight: 1.6 }}>
                          {feedback.comment}
                        </Typography>

                        {/* Date */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            Feedback provided on {new Date(feedback.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="Edit Feedback">
                            <IconButton
                              size="small"
                              onClick={() => handleEditFeedback(feedback)}
                              color="primary"
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Feedback">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteFeedback(feedback)}
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
              </>
            )}
          </Container>
        </Box>

        {/* Edit Feedback Modal */}
        <EditFeedbackModal 
          open={editModalOpen} 
          onClose={handleCloseEditModal}
          feedback={selectedFeedback}
        />

        {/* Delete Feedback Modal */}
        <DeleteReviewDialog 
          open={deleteModalOpen} 
          onClose={handleCloseDeleteModal}
          feedback={selectedFeedback}
        />
      </Layout>
    </ProtectedRoute>
  );
}

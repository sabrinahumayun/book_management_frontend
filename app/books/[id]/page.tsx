'use client';

import React, { useState, use } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Rating,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LibraryBooks,
  Person,
  CalendarToday,
  Star,
  RateReview,
  Edit,
  Add,
  ArrowBack,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { useBook } from '@/hooks/useBooks';
import { useFeedback, useCreateFeedback, useDeleteFeedback } from '@/hooks/useFeedback';
import { CreateFeedbackData } from '@/types/feedback';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';

interface FeedbackFormData {
  rating: number;
  comment: string;
}

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const resolvedParams = use(params);
  const bookId = parseInt(resolvedParams.id);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<number | null>(null);

  const { data: book, isLoading: bookLoading, error: bookError } = useBook(bookId);
  const { data: feedbackResponse, isLoading: feedbackLoading } = useFeedback({ bookId });
  const createFeedbackMutation = useCreateFeedback();
  const deleteFeedbackMutation = useDeleteFeedback();

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

  const handleOpenFeedback = () => {
    setEditingFeedback(null);
    reset({ rating: 5, comment: '' });
    setFeedbackOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackOpen(false);
    setEditingFeedback(null);
    reset();
  };

  const handleDeleteFeedback = (feedbackId: number) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      deleteFeedbackMutation.mutate(feedbackId);
    }
  };

  const onSubmitFeedback = (data: FeedbackFormData) => {
    const feedbackData: CreateFeedbackData = {
      ...data,
      bookId,
    };

    createFeedbackMutation.mutate(feedbackData, {
      onSuccess: () => {
        handleCloseFeedback();
      },
    });
  };

  const feedbacks = feedbackResponse?.data || [];
  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length 
    : 0;

  if (bookLoading) {
    return (
      <ProtectedRoute>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </ProtectedRoute>
    );
  }

  if (bookError || !book) {
    return (
      <ProtectedRoute>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }} suppressHydrationWarning>
          <Navigation />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error">
              Book not found or failed to load.
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
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '100vh' }}>
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            sx={{ mb: 3 }}
          >
            Back to Books
          </Button>

          {/* Book Details */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                <Box sx={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    sx={{
                      width: 200,
                      height: 200,
                      bgcolor: 'primary.main',
                      fontSize: '4rem',
                    }}
                  >
                    <LibraryBooks />
                  </Avatar>
                </Box>
                
                <Box sx={{ flex: '1 1 auto' }}>
                  <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    {book.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      by {book.author}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label={`ISBN: ${book.isbn}`}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Star sx={{ mr: 1, color: 'warning.main' }} />
                    <Rating value={averageRating} readOnly precision={0.1} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Added on {new Date(book.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Added by {book.creator.firstName} {book.creator.lastName}
                    </Typography>
                  </Box>
                  
                  {user?.id !== book.createdBy && (
                    <Button
                      variant="contained"
                      startIcon={<RateReview />}
                      onClick={handleOpenFeedback}
                      size="large"
                    >
                      Leave Feedback
                    </Button>
                  )}
                  {user?.id === book.createdBy && (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => router.push(`/books/${book.id}/edit`)}
                      size="large"
                    >
                      Edit Book
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Reviews & Feedback
              </Typography>
              
              {feedbackLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : feedbacks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <RateReview sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No reviews yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Be the first to share your thoughts about this book
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {feedbacks.map((feedback) => (
                    <Paper key={feedback.id} sx={{ p: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            {feedback.user.firstName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {feedback.user.firstName} {feedback.user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={feedback.rating} readOnly size="small" />
                          {(user?.id === feedback.userId || user?.role === 'admin') && (
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              color="error"
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.primary">
                        {feedback.comment}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
        </Box>
      </Layout>

        {/* Feedback Dialog */}
        <Dialog open={feedbackOpen} onClose={handleCloseFeedback} maxWidth="sm" fullWidth>
          <DialogTitle>Leave Your Feedback</DialogTitle>
          <form onSubmit={handleSubmit(onSubmitFeedback)}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Rating
                  </Typography>
                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: 'Rating is required' }}
                    render={({ field }) => (
                      <Rating
                        {...field}
                        size="large"
                        onChange={(event, newValue) => field.onChange(newValue)}
                      />
                    )}
                  />
                  {errors.rating && (
                    <Typography variant="caption" color="error">
                      {errors.rating.message}
                    </Typography>
                  )}
                </Box>
                
                <Controller
                  name="comment"
                  control={control}
                  rules={{
                    required: 'Comment is required',
                    minLength: {
                      value: 10,
                      message: 'Comment must be at least 10 characters',
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
                      helperText={errors.comment?.message}
                    />
                  )}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseFeedback}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createFeedbackMutation.isPending}
              >
                {createFeedbackMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
    </ProtectedRoute>
  );
}

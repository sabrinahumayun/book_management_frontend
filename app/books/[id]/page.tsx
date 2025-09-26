'use client';

import React, { useState, use } from 'react';
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
  Divider,
  Alert,
  CircularProgress,
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
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { useBook } from '@/hooks/useBooks';
import { useFeedbackByBook } from '@/hooks/useFeedback';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import AddFeedbackModal from '@/components/AddFeedbackModal';
import EditFeedbackModal from '@/components/EditFeedbackModal';
import EditBookModal from '@/components/EditBookModal';
import FeedbackList from '@/components/FeedbackList';
import { Feedback } from '@/types/feedback';


export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const resolvedParams = use(params);
  const bookId = parseInt(resolvedParams.id);
  const [addFeedbackOpen, setAddFeedbackOpen] = useState(false);
  const [editFeedbackOpen, setEditFeedbackOpen] = useState(false);
  const [editBookOpen, setEditBookOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const { data: book, isLoading: bookLoading, error: bookError } = useBook(bookId);
  const { data: feedbackResponse, isLoading: feedbackLoading } = useFeedbackByBook(bookId, { limit: 10 });

  const handleOpenAddFeedback = () => {
    setAddFeedbackOpen(true);
  };

  const handleCloseAddFeedback = () => {
    setAddFeedbackOpen(false);
  };

  const handleEditFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setEditFeedbackOpen(true);
  };

  const handleCloseEditFeedback = () => {
    setEditFeedbackOpen(false);
    setSelectedFeedback(null);
  };

  const handleOpenEditBook = () => {
    setEditBookOpen(true);
  };

  const handleCloseEditBook = () => {
    setEditBookOpen(false);
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
        <Box sx={{ minHeight: '100vh', bgcolor: (theme) => theme.palette.background.default }} suppressHydrationWarning>
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
        <Box sx={{ flexGrow: 1, bgcolor: (theme) => theme.palette.background.default, minHeight: '100vh' }}>
        
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
                      onClick={handleOpenAddFeedback}
                      size="large"
                    >
                      Leave Feedback
                    </Button>
                  )}
                  {user?.id === book.createdBy && (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleOpenEditBook}
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
              <FeedbackList 
                bookId={bookId} 
                onEditFeedback={handleEditFeedback}
              />
            </CardContent>
          </Card>
        </Container>
        </Box>
      </Layout>

        {/* Add Feedback Modal */}
        <AddFeedbackModal 
          open={addFeedbackOpen} 
          onClose={handleCloseAddFeedback}
          book={book}
        />
        
        {/* Edit Feedback Modal */}
        <EditFeedbackModal 
          open={editFeedbackOpen} 
          onClose={handleCloseEditFeedback}
          feedback={selectedFeedback}
        />
        
        {/* Edit Book Modal */}
        <EditBookModal 
          open={editBookOpen} 
          onClose={handleCloseEditBook}
          book={book}
        />
    </ProtectedRoute>
  );
}

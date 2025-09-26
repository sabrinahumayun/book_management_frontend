'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  LibraryBooks as SearchIcon,
  RateReview,
  Person,
  LibraryBooks,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ArrowBack as ClearIcon } from '@mui/icons-material';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import DeleteReviewDialog from '@/components/DeleteReviewDialog';
import { useAdminReviews, useDeleteFeedback } from '@/hooks/useFeedback';
import { FeedbackFilters, Feedback } from '@/types/feedback';

export default function AdminFeedbackPage() {
  const [filters, setFilters] = useState<FeedbackFilters>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  // Get all admin reviews without search filters for frontend filtering
  const { data: feedbackResponse, isLoading, error } = useAdminReviews({ page: 1, limit: 100 });
  const deleteFeedbackMutation = useDeleteFeedback();

  // Frontend filtering logic
  const allFeedbacks = feedbackResponse?.data || [];
  
  const filteredFeedbacks = allFeedbacks.filter(feedback => {
    // Search by username (firstName + lastName)
    const matchesSearch = !searchTerm || 
      feedback.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${feedback.user.firstName} ${feedback.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Pagination for filtered results
  const itemsPerPage = filters.limit || 10;
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = ((filters.page || 1) - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ page: 1, limit: 10 });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleDelete = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedFeedback(null);
  };


  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Feedback Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Moderate user feedback and reviews
            </Typography>
          </Box>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
                <Button variant="outlined" onClick={handleClearFilters} startIcon={<ClearIcon />}>
                  Clear
                </Button>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Per Page</InputLabel>
                  <Select
                    value={filters.limit || 10}
                    label="Per Page"
                    onChange={(e) => setFilters(prev => ({ ...prev, limit: e.target.value as number, page: 1 }))}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">Failed to load feedback. Please try again.</Alert>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {paginatedFeedbacks.map((feedback) => (
                  <Paper key={feedback.id} sx={{ p: 3 }}>
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
                            {feedback.user.email}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={feedback.rating} readOnly size="small" />
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(feedback)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        icon={<LibraryBooks />}
                        label={`${feedback.book.title} by ${feedback.book.author}`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                      {feedback.comment}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary">
                      {new Date(feedback.createdAt).toLocaleString()}
                    </Typography>
                  </Paper>
                ))}
              </Box>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={filters.page || 1}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Container>

        {/* Delete Review Modal */}
        <DeleteReviewDialog 
          open={deleteModalOpen} 
          onClose={handleCloseDeleteModal}
          feedback={selectedFeedback}
        />
      </AdminLayout>
    </ProtectedRoute>
  );
}

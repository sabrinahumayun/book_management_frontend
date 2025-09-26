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
  Visibility as SearchIcon,
  RateReview,
  Person,
  LibraryBooks,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useFeedback, useDeleteFeedback } from '@/hooks/useFeedback';
import { FeedbackFilters } from '@/types/feedback';

export default function AdminFeedbackPage() {
  const [filters, setFilters] = useState<FeedbackFilters>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: feedbackResponse, isLoading, error } = useFeedback(filters);
  const deleteFeedbackMutation = useDeleteFeedback();

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      search: searchTerm || undefined,
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      deleteFeedbackMutation.mutate(id);
    }
  };

  const feedbacks = feedbackResponse?.data || [];
  const totalPages = feedbackResponse?.totalPages || 0;

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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
                <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>
                  Search
                </Button>
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
                {feedbacks.map((feedback) => (
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
                          onClick={() => handleDelete(feedback.id)}
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
      </AdminLayout>
    </ProtectedRoute>
  );
}

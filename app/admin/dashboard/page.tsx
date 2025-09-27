'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import AddBookModal from '@/components/AddBookModal';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  LibraryBooks,
  People,
  RateReview,
  TrendingUp,
  Warning,
  Add,
  Person,
  LibraryBooks as BookOpen,
  Star as MessageSquare,
  Dashboard,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useBooks } from '@/hooks/useBooks';
import { useUsers } from '@/hooks/useUsers';
import { useFeedback } from '@/hooks/useFeedback';

export default function AdminDashboard() {
  const { isLoading } = useAuth();
  const [addBookOpen, setAddBookOpen] = useState(false);

  // Fetch data for dashboard
  const { data: booksResponse, isLoading: booksLoading } = useBooks({ page: 1, limit: 50 });
  const { data: usersResponse, isLoading: usersLoading } = useUsers({});
  const { data: feedbackResponse, isLoading: feedbackLoading } = useFeedback({ page: 1, limit: 50 });

  const totalBooks = booksResponse?.total || 0;
  const totalUsers = usersResponse?.total || 0;
  const totalFeedback = feedbackResponse?.total || 0;
  const recentBooks = booksResponse?.data?.slice(0, 5) || [];
  const recentFeedback = feedbackResponse?.data?.slice(0, 5) || [];

  const handleOpenAddBook = () => {
    setAddBookOpen(true);
  };

  const handleCloseAddBook = () => {
    setAddBookOpen(false);
  };


  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout onAddBook={handleOpenAddBook}>
        <Container maxWidth="xl" sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5, width: 40, height: 40 }}>
                <Dashboard />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Admin Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage books, users, and platform content
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Key Metrics */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {booksLoading ? '...' : totalBooks.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Total Books
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                      <LibraryBooks />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {usersLoading ? '...' : totalUsers.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Active Users
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                      <People />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {feedbackLoading ? '...' : totalFeedback.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Total Reviews
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                      <RateReview />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        +12.5%
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Monthly Growth
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                      <TrendingUp />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Recent Activity */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
              <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Recent Books
                  </Typography>
                  <List sx={{ py: 0 }}>
                    {recentBooks.map((book, index) => (
                      <React.Fragment key={book.id}>
                        <ListItem sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                              <BookOpen />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={book.title}
                            secondary={`by ${book.author} • ${new Date(book.createdAt).toLocaleDateString()}`}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                        {index < recentBooks.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
              <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Recent Activity
                  </Typography>
                  <List sx={{ py: 0 }}>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 24, height: 24 }}>
                          <Person />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="New user registered: john_doe"
                        secondary="2 hours ago"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                          <BookOpen />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="New book added: 'The Midnight Library'"
                        secondary="4 hours ago"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Avatar sx={{ bgcolor: 'warning.main', width: 24, height: 24 }}>
                          <Warning />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="Review reported: Inappropriate content"
                        secondary="6 hours ago"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>

        {/* Add Book Modal */}
        <AddBookModal 
          open={addBookOpen} 
          onClose={handleCloseAddBook}
        />
      </AdminLayout>
    </ProtectedRoute>
  );
}
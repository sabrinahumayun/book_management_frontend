'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  LibraryBooks,
  Star,
  RateReview,
  Home,
  Person,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export default function UserDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </Box>
    );
  }

  return (
    <ProtectedRoute requiredRole="user">
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }} suppressHydrationWarning>
        <Navigation />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Welcome to your Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage your books, reviews, and reading progress
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <LibraryBooks />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        12
                      </Typography>
                      <Typography color="text.secondary">
                        Books Read
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                      <Star />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        4.2
                      </Typography>
                      <Typography color="text.secondary">
                        Average Rating
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <RateReview />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        8
                      </Typography>
                      <Typography color="text.secondary">
                        Reviews Written
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                      <Home />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        3
                      </Typography>
                      <Typography color="text.secondary">
                        Currently Reading
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Recent Books */}
            <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Recent Books
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <LibraryBooks />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="The Great Gatsby"
                        secondary="Completed 2 days ago"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                        <Typography variant="body2">4.5</Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'success.light' }}>
                          <LibraryBooks />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="To Kill a Mockingbird"
                        secondary="Currently reading"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Home sx={{ color: 'primary.main', mr: 0.5 }} />
                        <Typography variant="body2">65%</Typography>
                      </Box>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>

            {/* Quick Actions */}
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<LibraryBooks />}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Browse Books
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RateReview />}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Write a Review
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Star />}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Rate a Book
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}

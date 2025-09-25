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
  Alert,
} from '@mui/material';
import {
  LibraryBooks,
  People,
  RateReview,
  Shield,
  TrendingUp,
  Warning,
  Add,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </Box>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }} suppressHydrationWarning>
        <Navigation />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <Shield />
              </Avatar>
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold">
                  Admin Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Manage books, users, and platform content
                </Typography>
              </Box>
            </Box>
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
                        1,247
                      </Typography>
                      <Typography color="text.secondary">
                        Total Books
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
                      <People />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        2,341
                      </Typography>
                      <Typography color="text.secondary">
                        Active Users
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
                      <RateReview />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        23
                      </Typography>
                      <Typography color="text.secondary">
                        Pending Reviews
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
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        +12.5%
                      </Typography>
                      <Typography color="text.secondary">
                        Monthly Growth
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {/* Quick Actions */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Add New Book
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<People />}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Manage Users
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RateReview />}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Moderate Reviews
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* System Alerts */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    System Alerts
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Alert severity="warning" icon={<Warning />}>
                      <Typography variant="body2" fontWeight="bold">
                        High Server Load
                      </Typography>
                      <Typography variant="caption">
                        CPU usage at 85%
                      </Typography>
                    </Alert>
                    <Alert severity="info" icon={<RateReview />}>
                      <Typography variant="body2" fontWeight="bold">
                        New Reviews
                      </Typography>
                      <Typography variant="caption">
                        23 reviews pending approval
                      </Typography>
                    </Alert>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Recent Activity */}
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.light' }}>
                      <People />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="body2" component="span" fontWeight="bold">
                          New user registered:
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                          john_doe
                        </Typography>
                      </Box>
                    }
                    secondary="2 hours ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <LibraryBooks />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="body2" component="span" fontWeight="bold">
                          New book added:
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                          "The Midnight Library"
                        </Typography>
                      </Box>
                    }
                    secondary="4 hours ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'warning.light' }}>
                        <RateReview />
                      </Avatar>
                    </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="body2" component="span" fontWeight="bold">
                          Review reported:
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                          Inappropriate content
                        </Typography>
                      </Box>
                    }
                    secondary="6 hours ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}

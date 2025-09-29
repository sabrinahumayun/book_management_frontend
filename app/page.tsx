'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Avatar,
  Paper,
} from '@mui/material';
import {
  LibraryBooks,
  People,
  Shield,
  Star,
  ArrowForward,
  Security,
  RateReview,
  Dashboard,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  // Show loading only briefly to avoid flash
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          border: (theme) => `4px solid ${theme.palette.mode === 'dark' ? '#475569' : '#f3f3f3'}`, 
          borderTop: (theme) => `4px solid ${theme.palette.primary.main}`, 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: (theme) => theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Navigation */}
      <AppBar position="static" elevation={0} sx={{ 
        bgcolor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(30, 41, 59, 0.9)' 
          : 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)' 
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <LibraryBooks sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Book Portal
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DarkModeToggle />
            {isAuthenticated ? (
              <>
                <Link href="/books" style={{ textDecoration: 'none' }}>
                  <Button variant="text" color="primary">
                    My Books
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="text" color="primary">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Link href="/profile" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" color="primary">
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="text" color="primary">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ color: 'white', mb: 3 }}>
          Manage Your{' '}
          <Typography component="span" variant="h2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#8fa4f3' : '#42a5f5' }}>
            Book Collection
          </Typography>
        </Typography>
        <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, maxWidth: '800px', mx: 'auto' }}>
          A comprehensive book management system with user authentication, 
          role-based access, and modern interface design.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <>
              <Link href="/books" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Go to My Books
                </Button>
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: (theme) => theme.palette.background.default, py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
              Everything you need to manage books
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Powerful features designed for both individual users and administrators
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                        <LibraryBooks sx={{ fontSize: 32 }} />
                      </Avatar>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    Book Management
                  </Typography>
                  <Typography color="text.secondary">
                    Add, edit, and organize your book collection with detailed information and categories.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <People sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    User Management
                  </Typography>
                  <Typography color="text.secondary">
                    Admin tools for managing users, roles, and permissions across the platform.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <Security sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    Secure Access
                  </Typography>
                  <Typography color="text.secondary">
                    Role-based authentication with JWT tokens and secure route protection.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <RateReview sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    Reviews & Ratings
                  </Typography>
                  <Typography color="text.secondary">
                    Rate and review books with a comprehensive feedback system.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                      <Avatar sx={{ bgcolor: 'error.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                        <LibraryBooks sx={{ fontSize: 32 }} />
                      </Avatar>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    Modern UI
                  </Typography>
                  <Typography color="text.secondary">
                    Beautiful, responsive interface built with Next.js and Material-UI.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'info.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <Dashboard sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    Admin Dashboard
                  </Typography>
                  <Typography color="text.secondary">
                    Comprehensive admin panel for managing the entire platform.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        bgcolor: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #8fa4f3 0%, #9c7bb8 100%)'
          : 'primary.main', 
        py: 8 
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          {isAuthenticated ? (
            <>
              <Typography variant="h3" component="h2" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
                Welcome back, {user?.firstName}!
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4 }}>
                Continue managing your book collection and discover new reads
              </Typography>
              <Link href="/books" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Go to My Books
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Typography variant="h3" component="h2" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
                Ready to get started?
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4 }}>
                Join thousands of users managing their book collections
              </Typography>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Create Your Account
                </Button>
              </Link>
            </>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <LibraryBooks sx={{ color: 'primary.light', mr: 1 }} />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Book Portal
                  </Typography>
                </Box>
            <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
              © 2024 Book Management Portal. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
              <Button color="inherit" size="small">Privacy Policy</Button>
              <Button color="inherit" size="small">Terms of Service</Button>
              <Button color="inherit" size="small">Contact</Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  LibraryBooks,
  People,
  RateReview,
  ArrowBack,
  Menu,
  Settings,
  Shield,
  TrendingUp,
  Warning,
  Add,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useBooks } from '@/hooks/useBooks';
import { useUsers } from '@/hooks/useUsers';
import { useFeedback } from '@/hooks/useFeedback';
import DarkModeToggle from './DarkModeToggle';

const drawerWidth = 280;

interface AdminLayoutProps {
  children: React.ReactNode;
  onAddBook?: () => void;
}

export default function AdminLayout({ children, onAddBook }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Fetch data for sidebar stats
  const { data: booksResponse } = useBooks({ page: 1, limit: 50 });
  const { data: usersResponse } = useUsers({});
  const { data: feedbackResponse } = useFeedback({ page: 1, limit: 50 });

  const totalBooks = booksResponse?.total || 0;
  const totalUsers = usersResponse?.total || 0;
  const totalFeedback = feedbackResponse?.total || 0;

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/admin/dashboard',
      badge: null,
    },
    {
      text: 'Books',
      icon: <LibraryBooks />,
      path: '/admin/books',
      badge: totalBooks > 0 ? totalBooks : null,
    },
    {
      text: 'Users',
      icon: <People />,
      path: '/admin/users',
      badge: totalUsers > 0 ? totalUsers : null,
    },
    {
      text: 'Feedback',
      icon: <RateReview />,
      path: '/admin/feedback',
      badge: totalFeedback > 0 ? totalFeedback : null,
    },
  ];

  const quickActions = [
    {
      text: 'Add Book',
      icon: <Add />,
      action: () => onAddBook?.(),
    },
    {
      text: 'User Stats',
      icon: <TrendingUp />,
      action: () => handleNavigation('/admin/users'),
    },
    {
      text: 'Reviews',
      icon: <RateReview />,
      action: () => handleNavigation('/admin/feedback'),
    },
    {
      text: 'Settings',
      icon: <Settings />,
      action: () => handleNavigation('/admin/settings'),
    },
  ];

  const sidebar = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
            <Shield />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Admin Portal
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          System Administration
        </Typography>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ 
        p: 2, 
        background: 'rgba(102, 126, 234, 0.1)',
        borderBottom: '1px solid rgba(102, 126, 234, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label="★ Administrator" 
          color="primary" 
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Stats Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" fontWeight="600" color="text.primary" gutterBottom>
          System Overview
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">Total Books</Typography>
            <Chip label={totalBooks} size="small" color="primary" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">Total Users</Typography>
            <Chip label={totalUsers} size="small" color="secondary" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">Total Reviews</Typography>
            <Chip label={totalFeedback} size="small" color="success" />
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="subtitle2" fontWeight="600" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          NAVIGATION
        </Typography>
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={pathname === item.path}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{ 
                    fontWeight: pathname === item.path ? 600 : 400,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      {/* Quick Actions */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" fontWeight="600" color="text.primary" gutterBottom>
          QUICK ACTIONS
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {quickActions.map((action, index) => (
            <Tooltip key={index} title={action.text}>
              <IconButton
                onClick={action.action}
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
        
        {onAddBook && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddBook}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Add New Book
          </Button>
        )}
      </Box>

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleLogout}
          fullWidth
          sx={{
            borderColor: 'error.main',
            color: 'error.main',
            '&:hover': {
              borderColor: 'error.dark',
              backgroundColor: 'error.main',
              color: 'white',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={handleSidebarToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Portal
          </Typography>
          <DarkModeToggle />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          },
        }}
      >
        {sidebar}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          mt: '64px', // App bar height
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: (theme) => theme.palette.background.default,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '1400px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  LibraryBooks,
  Person,
  Add,
  RateReview,
  Star,
  People,
  Settings,
} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useBooks, useMyBooks } from '@/hooks/useBooks';

const drawerWidth = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onAddBook?: () => void;
}

export default function Sidebar({ open, onClose, onAddBook }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';

  // Get user's book stats with better error handling
  const { data: myBooksResponse, isLoading: myBooksLoading, error: myBooksError } = useMyBooks({ 
    limit: 10,
    page: 1 
  });
  const { data: allBooksResponse, isLoading: allBooksLoading, error: allBooksError } = useBooks({ 
    limit: 10,
    page: 1 
  });
  
  // More robust count calculation
  const myBooksCount = React.useMemo(() => {
    if (!myBooksResponse) return 0;
    if (Array.isArray(myBooksResponse.data)) {
      return myBooksResponse.data.length;
    }
    if (Array.isArray(myBooksResponse)) {
      return myBooksResponse.length;
    }
    return 0;
  }, [myBooksResponse]);

  const totalBooksCount = React.useMemo(() => {
    if (!allBooksResponse) return 0;
    if (Array.isArray(allBooksResponse.data)) {
      return allBooksResponse.data.length;
    }
    if (Array.isArray(allBooksResponse)) {
      return allBooksResponse.length;
    }
    return 0;
  }, [allBooksResponse]);

  
  const navigationItems = [
    ...(isAdmin ? [
      { name: 'Dashboard', href: '/admin/dashboard', icon: Dashboard, badge: null },
    ] : []),
    { name: 'My Books', href: '/books', icon: LibraryBooks, badge: myBooksCount },
    ...(isAdmin ? [
      { name: 'All Books', href: '/admin/books', icon: People, badge: totalBooksCount },
      { name: 'Feedback', href: '/admin/feedback', icon: RateReview, badge: null },
    ] : []),
  ];

  const quickActions = [
    { name: 'Search Books', icon: LibraryBooks, action: () => router.push('/books') },
    { name: 'My Profile', icon: Person, action: () => router.push('/profile') },
    { name: 'My Reviews', icon: RateReview, action: () => router.push('/my-reviews') },
    ...(isAdmin ? [
      { name: 'Settings', icon: Settings, action: () => router.push('/admin/settings') },
    ] : []),
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <LibraryBooks sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight="bold" color="white">
              Book Portal
            </Typography>
          </Box>
          {isMobile && (
            <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ 
        p: 3, 
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            mr: 2,
            width: 48,
            height: 48,
            border: '2px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h6" fontWeight="bold" color="white">
              {user?.firstName?.[0] || 'U'}
            </Typography>
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="600" color="white">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
        
        {/* User Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ 
            flex: 1, 
            p: 1.5, 
            borderRadius: 2, 
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Typography variant="h6" fontWeight="bold" color="white" sx={{ textAlign: 'center' }}>
              {myBooksLoading ? '...' : myBooksError ? '!' : myBooksCount}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', display: 'block' }}>
              My Books
            </Typography>
            {myBooksError && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', display: 'block', fontSize: '0.7rem' }}>
                Error loading
              </Typography>
            )}
          </Box>
          {isAdmin && (
            <Box sx={{ 
              flex: 1, 
              p: 1.5, 
              borderRadius: 2, 
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Typography variant="h6" fontWeight="bold" color="white" sx={{ textAlign: 'center' }}>
                {allBooksLoading ? '...' : allBooksError ? '!' : totalBooksCount}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', display: 'block' }}>
                Total Books
              </Typography>
              {allBooksError && (
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', display: 'block', fontSize: '0.7rem' }}>
                  Error loading
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {isAdmin && (
          <Chip
            icon={<Star sx={{ fontSize: 16 }} />}
            label="Administrator"
            sx={{ 
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
            size="small"
          />
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Typography variant="caption" sx={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontWeight: 600, 
          textTransform: 'uppercase',
          letterSpacing: 1,
          mb: 2,
          display: 'block',
          px: 1
        }}>
          Navigation
        </Typography>
        <List sx={{ px: 0 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.href)}
                selected={pathname === item.href}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  background: pathname === item.href ? 'rgba(255,255,255,0.2)' : 'transparent',
                  backdropFilter: pathname === item.href ? 'blur(10px)' : 'none',
                  border: pathname === item.href ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                    minWidth: 40,
                  },
                  '& .MuiListItemText-primary': {
                    color: 'white',
                    fontWeight: pathname === item.href ? 600 : 500,
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.name} />
                {item.badge !== null && (
                  <Badge 
                    badgeContent={item.badge} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        background: 'rgba(255,255,255,0.9)',
                        color: '#667eea',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                      }
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontWeight: 600, 
          textTransform: 'uppercase',
          letterSpacing: 1,
          mb: 2,
          display: 'block',
          px: 1
        }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {quickActions.map((action, index) => (
            <Tooltip key={index} title={action.name} arrow>
              <IconButton
                onClick={() => {
                  action.action();
                  if (isMobile) onClose();
                }}
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <action.icon fontSize="small" />
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* Add Book Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => {
            if (onAddBook) {
              onAddBook();
            } else {
              handleNavigation('/add-book');
            }
            if (isMobile) {
              onClose();
            }
          }}
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            color: 'white',
            py: 2,
            px: 2,
            boxShadow: '0 4px 15px rgba(74, 222, 128, 0.4)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              boxShadow: '0 6px 20px rgba(74, 222, 128, 0.6)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <Add />
          </ListItemIcon>
          <ListItemText 
            primary="Add New Book" 
            primaryTypographyProps={{ 
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
          />
        </ListItemButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 1.5,
            color: 'rgba(255,255,255,0.8)',
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ 
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '0 0 30px rgba(102, 126, 234, 0.3)',
          background: 'transparent',
          overflow: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

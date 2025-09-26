'use client';

import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  onAddBook?: () => void;
}

export default function Layout({ children, onAddBook }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start with sidebar open
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const handleProfileClick = () => {
    router.push('/profile');
    handleProfileMenuClose();
  };

  const handleReviewsClick = () => {
    router.push('/my-reviews');
    handleProfileMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} onAddBook={onAddBook} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: sidebarOpen ? `calc(100% - 280px)` : '100%' },
            ml: { md: sidebarOpen ? '280px' : 0 },
            backgroundColor: (theme) => theme.palette.background.paper,
            color: 'text.primary',
            boxShadow: (theme) => theme.palette.mode === 'dark' 
              ? '0 1px 3px rgba(0,0,0,0.3)'
              : '0 1px 3px rgba(0,0,0,0.1)',
            zIndex: theme.zIndex.drawer + 1,
            transition: 'width 0.3s ease, margin-left 0.3s ease',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Book Portal
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DarkModeToggle />
              
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={isMenuOpen ? 'profile-menu' : undefined}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 32,
                    height: 32,
                  }}
                >
                  {user?.firstName?.[0] || 'U'}
                </Avatar>
              </IconButton>
            </Box>

            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={isMenuOpen}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: (theme) => theme.palette.mode === 'dark' 
                    ? '0 8px 32px rgba(0,0,0,0.4)'
                    : '0 8px 32px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              
              <Divider />
              
              <MenuItem onClick={handleProfileClick}>
                <Typography variant="body2">My Profile</Typography>
              </MenuItem>
              
              <MenuItem onClick={handleReviewsClick}>
                <Typography variant="body2">My Reviews</Typography>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <Typography variant="body2" color="error">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            pt: '64px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

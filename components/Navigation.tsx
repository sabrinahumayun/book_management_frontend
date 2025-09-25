'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  LibraryBooks,
  Home,
  Person,
  Settings,
  Menu as MenuIcon,
  Shield,
  People,
  RateReview,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isAdmin = user?.role === 'admin';

      const navigationItems = [
        { name: 'Dashboard', href: isAdmin ? '/admin/dashboard' : '/dashboard', icon: Home },
        { name: 'Books', href: isAdmin ? '/admin/books' : '/books', icon: LibraryBooks },
        { name: 'Profile', href: '/profile', icon: Person },
        ...(isAdmin ? [
          { name: 'Users', href: '/admin/users', icon: People },
          { name: 'Feedback', href: '/admin/feedback', icon: RateReview },
        ] : []),
      ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Book Portal
      </Typography>
      <Divider />
      <List>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.name} disablePadding>
              <Link
                href={item.href}
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
        <Divider />
        <ListItem>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', p: 1 }}>
            {isAdmin && (
              <Chip
                icon={<Shield />}
                label="Admin"
                color="secondary"
                size="small"
                sx={{ mr: 1 }}
              />
            )}
            <Typography variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
          </Box>
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Settings />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Link href={isAdmin ? '/admin/dashboard' : '/dashboard'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                  <LibraryBooks sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Book Portal
              </Typography>
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    sx={{
                      color: 'text.primary',
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'primary.50',
                        color: 'primary.main',
                      },
                    }}
                    startIcon={<Icon />}
                  >
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {isAdmin && (
              <Chip
                icon={<Shield />}
                label="Admin"
                color="secondary"
                size="small"
                sx={{ mr: 2 }}
              />
            )}
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={handleLogout}
              size="small"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

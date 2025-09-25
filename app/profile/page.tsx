'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Container,
  Alert,
  Avatar,
  Chip,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Person,
  Email,
  CalendarToday,
  Shield,
  Save,
  Edit,
  ArrowBack,
} from '@mui/icons-material';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/lib/utils';

interface ProfileFormData {
  email: string;
  firstName: string;
  lastName: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const { user, updateProfile, isUpdatingProfile, updateProfileError, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data);
    setMessage('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    setMessage('');
  };

  if (isLoading || !user) {
    return (
      <ProtectedRoute>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }} suppressHydrationWarning>
        <Navigation />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                  Profile Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your account information and preferences
                </Typography>
              </Box>
              {!isEditing && (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Profile Information */}
            <Box sx={{ flex: '2 1 600px', minWidth: '600px' }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Personal Information
                  </Typography>

                  {message && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      {message}
                    </Alert>
                  )}

                  {updateProfileError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {updateProfileError.response?.data?.message || 'Failed to update profile. Please try again.'}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box>
                        <Controller
                          name="email"
                          control={control}
                          rules={{
                            required: 'Email is required',
                            validate: (value) => validateEmail(value) || 'Please enter a valid email',
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Email Address"
                              type="email"
                              disabled={!isEditing}
                              error={!!errors.email}
                              helperText={errors.email?.message}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Email color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                          <Controller
                            name="firstName"
                          control={control}
                          rules={{
                            required: 'First name is required',
                            minLength: {
                              value: 2,
                              message: 'First name must be at least 2 characters',
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="First Name"
                              disabled={!isEditing}
                              error={!!errors.firstName}
                              helperText={errors.firstName?.message}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Person color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                        </Box>

                        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                          <Controller
                            name="lastName"
                          control={control}
                          rules={{
                            required: 'Last name is required',
                            minLength: {
                              value: 2,
                              message: 'Last name must be at least 2 characters',
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Last Name"
                              disabled={!isEditing}
                              error={!!errors.lastName}
                              helperText={errors.lastName?.message}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Person color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                        </Box>
                      </Box>

                      {isEditing && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                              variant="outlined"
                              onClick={handleCancel}
                              disabled={isUpdatingProfile}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<Save />}
                              disabled={isUpdatingProfile}
                            >
                              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Profile Summary */}
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Account Info */}
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      Account Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Full Name
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                          <Email />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Email Address
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: user.role === 'admin' ? 'secondary.main' : 'grey.400', mr: 2 }}>
                          <Shield />
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
                              {user.role}
                            </Typography>
                            {user.role === 'admin' && (
                              <Chip
                                icon={<Shield />}
                                label="Admin"
                                color="secondary"
                                size="small"
                              />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Account Type
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'grey.400', mr: 2 }}>
                          <CalendarToday />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Member Since
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      Quick Stats
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Books Read
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          12
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Reviews Written
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          8
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Currently Reading
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          3
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}

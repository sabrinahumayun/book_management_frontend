'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { useCreateUser } from '@/hooks/useUsers';
import { CreateUserData } from '@/lib/usersApi';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

export default function AddUserModal({ open, onClose }: AddUserModalProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const createUserMutation = useCreateUser();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true,
    },
  });

  const onSubmit = (data: UserFormData) => {
    const userData: CreateUserData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    createUserMutation.mutate(userData, {
      onSuccess: () => {
        setShowSuccessMessage(true);
        setTimeout(() => {
          onClose();
          setShowSuccessMessage(false);
          reset();
        }, 1500);
      },
      onError: (error) => {
        console.error('Error creating user:', error);
      },
    });
  };

  const handleFieldChange = () => {
    // Clear mutation errors when user starts typing
    if (createUserMutation.error) {
      createUserMutation.reset();
    }
  };

  const getErrorMessage = () => {
    if (!createUserMutation.error) return null;
    
    const error = createUserMutation.error as any;
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.response?.status === 400) {
      return 'Invalid user data. Please check your input.';
    }
    
    if (error?.response?.status === 401) {
      return 'You are not authorized to create users.';
    }
    
    if (error?.response?.status === 403) {
      return 'You do not have permission to create users.';
    }
    
    if (error?.response?.status === 409) {
      return 'Email already exists. Please use a different email.';
    }
    
    if (error?.response?.status >= 500) {
      return 'Server error occurred. Please try again later.';
    }
    
    return 'An unexpected error occurred. Please try again.';
  };

  const handleClose = () => {
    if (!createUserMutation.isPending) {
      onClose();
      setShowSuccessMessage(false);
      reset();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div">
            Add New User
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
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
                  margin="normal"
                  required
                  fullWidth
                  label="First Name"
                  autoComplete="given-name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange();
                  }}
                />
              )}
            />

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
                  margin="normal"
                  required
                  fullWidth
                  label="Last Name"
                  autoComplete="family-name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange();
                  }}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange();
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange();
                  }}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              rules={{ required: 'Role is required' }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    {...field}
                    label="Role"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.role.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        handleFieldChange();
                      }}
                    />
                  }
                  label="Active User"
                  sx={{ mt: 2 }}
                />
              )}
            />

            {getErrorMessage() && (
              <Alert 
                severity="error" 
                sx={{ mt: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={() => createUserMutation.reset()}>
                    Dismiss
                  </Button>
                }
              >
                {getErrorMessage()}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={createUserMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={createUserMutation.isPending}
            startIcon={createUserMutation.isPending ? <CircularProgress size={20} /> : null}
          >
            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccessMessage(false)}>
          User created successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

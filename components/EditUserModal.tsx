'use client';

import React, { useState, useEffect } from 'react';
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
import { useUpdateUser } from '@/hooks/useUsers';
import { User, UpdateUserData } from '@/types/auth';
import { toast } from 'react-toastify';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

export default function EditUserModal({ open, onClose, user }: EditUserModalProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const updateUserMutation = useUpdateUser();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      isActive: true,
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UserFormData) => {
    if (!user) return;

    const updateData: UpdateUserData = {
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      isActive: data.isActive,
    };

    updateUserMutation.mutate(
      { id: user.id, data: updateData },
      {
        onSuccess: () => {
          toast.success(`User ${data.firstName} ${data.lastName} updated successfully! ✏️`);
          setShowSuccessMessage(true);
          setTimeout(() => {
            onClose();
            setShowSuccessMessage(false);
          }, 1500);
        },
        onError: (error) => {
          console.error('Error updating user:', error);
          const errorMessage = getErrorMessage();
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleFieldChange = () => {
    // Clear mutation errors when user starts typing
    if (updateUserMutation.error) {
      updateUserMutation.reset();
    }
  };

  const getErrorMessage = () => {
    if (!updateUserMutation.error) return null;
    
    const error = updateUserMutation.error as any;
    
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
      return 'You are not authorized to update this user.';
    }
    
    if (error?.response?.status === 403) {
      return 'You do not have permission to update users.';
    }
    
    if (error?.response?.status === 404) {
      return 'User not found.';
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
    if (!updateUserMutation.isPending) {
      onClose();
      setShowSuccessMessage(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div">
            Edit User
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
                  <Button color="inherit" size="small" onClick={() => updateUserMutation.reset()}>
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
          <Button onClick={handleClose} disabled={updateUserMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={updateUserMutation.isPending}
            startIcon={updateUserMutation.isPending ? <CircularProgress size={20} /> : null}
          >
            {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

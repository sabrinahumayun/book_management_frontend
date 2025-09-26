'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit,
  Delete,
  PersonAdd,
  FilterList,
  Refresh,
} from '@mui/icons-material';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { UserFilters } from '@/lib/usersApi';
import { User } from '@/types/auth';

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: usersResponse, isLoading, error } = useUsers(filters);
  const deleteUserMutation = useDeleteUser();

  // Debug: Log the response data
  useEffect(() => {
    console.log('Users response:', usersResponse);
    console.log('Users loading:', isLoading);
    console.log('Users error:', error);
    console.log('Users array:', usersResponse?.data);
    console.log('Users total:', usersResponse?.total);
    console.log('Users response type:', typeof usersResponse);
    console.log('Users response keys:', usersResponse ? Object.keys(usersResponse) : 'undefined');
  }, [usersResponse, isLoading, error]);

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      search: searchTerm || undefined,
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const users = usersResponse?.data || [];
  const totalPages = usersResponse?.totalPages || 0;
  
  // Debug: Log the extracted users
  console.log('Extracted users:', users);
  console.log('Users length:', users.length);

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                  User Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage user accounts and permissions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="Refresh Data">
                  <IconButton color="primary">
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  sx={{ minWidth: 140 }}
                >
                  Add User
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
                <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>
                  Search
                </Button>
                <Button variant="outlined" onClick={handleClearFilters} startIcon={<ClearIcon />}>
                  Clear
                </Button>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filters.role || ''}
                    label="Role"
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' || undefined }))}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Per Page</InputLabel>
                  <Select
                    value={filters.limit || 10}
                    label="Per Page"
                    onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value) }))}
                  >
                    <MenuItem value={5}>5 per page</MenuItem>
                    <MenuItem value={10}>10 per page</MenuItem>
                    <MenuItem value={25}>25 per page</MenuItem>
                    <MenuItem value={50}>50 per page</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error">
                  Failed to load users. Please try again.
                </Alert>
              ) : (
                <>
                  {/* Debug info */}
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2">
                      Debug: Found {users.length} users. Loading: {isLoading ? 'Yes' : 'No'}. Error: {error ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Joined</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                  {user.firstName[0]}{user.lastName[0]}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="600">
                                    {user.firstName} {user.lastName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    ID: {user.id}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {user.email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.role}
                                color={user.role === 'admin' ? 'primary' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.isActive ? "Active" : "Inactive"}
                                color={user.isActive ? "success" : "default"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Tooltip title="Edit User">
                                  <IconButton size="small" color="primary">
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete User">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteClick(user)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination
                        count={totalPages}
                        page={filters.page || 1}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Container>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user "{selectedUser?.firstName} {selectedUser?.lastName}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </AdminLayout>
    </ProtectedRoute>
  );
}

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
  Checkbox,
} from '@mui/material';
import {
  LibraryBooks as SearchIcon,
  ArrowBack as ClearIcon,
  Edit,
  Delete as DeleteIcon,
  Person as Add,
  Settings as FilterIcon,
  ArrowBack as RefreshIcon,
} from '@mui/icons-material';
import { useUsers, useDeleteUser, useBulkDeleteUsers } from '@/hooks/useUsers';
import { UserFilters } from '@/lib/usersApi';
import { User } from '@/types/auth';
import EditUserModal from '@/components/EditUserModal';
import AddUserModal from '@/components/AddUserModal';
import BulkDeleteDialog from '@/components/BulkDeleteDialog';
import { toast } from 'react-toastify';

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'admin' | 'user' | ''>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Get all users without search filters for frontend filtering
  const { data: usersResponse, isLoading, error } = useUsers({ page: 1, limit: 100 });
  const deleteUserMutation = useDeleteUser();
  const bulkDeleteUsersMutation = useBulkDeleteUsers();


  // Frontend filtering logic
  const allUsers = usersResponse?.data || [];
  
  const filteredUsers = allUsers.filter(user => {
    // Search filter
    const matchesSearch = !searchTerm || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Pagination for filtered results
  const itemsPerPage = filters.limit || 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = ((filters.page || 1) - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);


  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setFilters({ page: 1, limit: 10 });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id, {
        onSuccess: () => {
          toast.success(`User ${selectedUser.firstName} ${selectedUser.lastName} deleted successfully! 🗑️`);
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || 'Failed to delete user';
          toast.error(errorMessage);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Bulk delete handlers
  const handleSelectUser = (userId: number) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === paginatedUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(paginatedUsers.map(user => user.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedUserIds.length === 0) {
      toast.error('No users selected for deletion');
      return;
    }
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = () => {
    bulkDeleteUsersMutation.mutate(selectedUserIds, {
      onSuccess: () => {
        toast.success(`Successfully deleted ${selectedUserIds.length} users! 🗑️`);
        setSelectedUserIds([]);
        setBulkDeleteDialogOpen(false);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || 'Failed to delete users';
        toast.error(errorMessage);
      },
    });
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteDialogOpen(false);
  };


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
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddUserOpen(true)}
                  sx={{ minWidth: 140 }}
                >
                  Add User
                </Button>
                
                {selectedUserIds.length > 0 && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleBulkDelete}
                    sx={{ minWidth: 140 }}
                  >
                    Delete ({selectedUserIds.length})
                  </Button>
                )}
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
                <Button variant="outlined" onClick={handleClearFilters} startIcon={<ClearIcon />}>
                  Clear
                </Button>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilter}
                    label="Role"
                    onChange={(e) => {
                      const role = e.target.value as 'admin' | 'user' | '';
                      setRoleFilter(role);
                      setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page
                    }}
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
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedUserIds.length === paginatedUsers.length && paginatedUsers.length > 0}
                              indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < paginatedUsers.length}
                              onChange={handleSelectAll}
                            />
                          </TableCell>
                          <TableCell>User</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Joined</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                          <TableRow key={user.id} hover>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedUserIds.includes(user.id)}
                                onChange={() => handleSelectUser(user.id)}
                              />
                            </TableCell>
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
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handleEditClick(user)}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete User">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteClick(user)}
                                  >
                                    <DeleteIcon />
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

        {/* Edit User Modal */}
        <EditUserModal
          open={editUserOpen}
          onClose={() => {
            setEditUserOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />

        {/* Add User Modal */}
        <AddUserModal
          open={addUserOpen}
          onClose={() => setAddUserOpen(false)}
        />

        {/* Bulk Delete Dialog */}
        <BulkDeleteDialog
          open={bulkDeleteDialogOpen}
          onClose={handleBulkDeleteCancel}
          onConfirm={handleBulkDeleteConfirm}
          isLoading={bulkDeleteUsersMutation.isPending}
          title="Bulk Delete Users"
          items={paginatedUsers
            .filter(user => selectedUserIds.includes(user.id))
            .map(user => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              subtitle: user.email
            }))
          }
          selectedCount={selectedUserIds.length}
          itemType="users"
        />
      </AdminLayout>
    </ProtectedRoute>
  );
}

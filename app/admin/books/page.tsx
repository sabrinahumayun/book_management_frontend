'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Avatar,
  InputAdornment,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Visibility as SearchIcon,
  Edit,
  LibraryBooks,
  Person,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { useForm, Controller } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '@/hooks/useBooks';
import { Book, CreateBookData, UpdateBookData, BookFilters } from '@/types/books';

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
}

export default function AdminBooksPage() {
  const [open, setOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [filters, setFilters] = useState<BookFilters>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: booksResponse, isLoading, error } = useBooks(filters);
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
    },
  });

  const handleOpen = () => {
    setEditingBook(null);
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBook(null);
    reset();
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    reset({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBookMutation.mutate(id);
    }
  };

  const onSubmit = (data: BookFormData) => {
    if (editingBook) {
      updateBookMutation.mutate(
        { id: editingBook.id, data: data as UpdateBookData },
        {
          onSuccess: () => {
            handleClose();
          },
        }
      );
    } else {
      createBookMutation.mutate(data as CreateBookData, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      title: searchTerm || undefined,
      page: 1,
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

  const books = booksResponse?.data || [];
  const totalPages = booksResponse?.totalPages || 0;

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                  Books Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your book collection
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpen}
                sx={{ minWidth: 140 }}
              >
                Add Book
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search by title..."
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
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Per Page</InputLabel>
                  <Select
                    value={filters.limit || 10}
                    label="Per Page"
                    onChange={(e) => setFilters(prev => ({ ...prev, limit: e.target.value as number, page: 1 }))}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Books Table */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ m: 2 }}>
                  Failed to load books. Please try again.
                </Alert>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell>Author</TableCell>
                          <TableCell>ISBN</TableCell>
                          <TableCell>Created By</TableCell>
                          <TableCell>Created At</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {books.map((book) => (
                          <TableRow key={book.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                  <LibraryBooks />
                                </Avatar>
                                <Typography variant="body2" fontWeight="medium">
                                  {book.title}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                {book.author}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={book.isbn} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {book.creator.firstName} {book.creator.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {book.creator.email}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(book.createdAt).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(book)}
                                    color="primary"
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(book.id)}
                                    color="error"
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
                  
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <Pagination
                        count={totalPages}
                        page={filters.page || 1}
                        onChange={handlePageChange}
                        color="primary"
                      />
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Container>

        {/* Add/Edit Book Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: 'Title is required',
                    minLength: {
                      value: 2,
                      message: 'Title must be at least 2 characters',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Title"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
                
                <Controller
                  name="author"
                  control={control}
                  rules={{
                    required: 'Author is required',
                    minLength: {
                      value: 2,
                      message: 'Author must be at least 2 characters',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Author"
                      error={!!errors.author}
                      helperText={errors.author?.message}
                    />
                  )}
                />
                
                <Controller
                  name="isbn"
                  control={control}
                  rules={{
                    required: 'ISBN is required',
                    pattern: {
                      value: /^[\d-]+$/,
                      message: 'ISBN must contain only numbers and hyphens',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="ISBN"
                      error={!!errors.isbn}
                      helperText={errors.isbn?.message}
                    />
                  )}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createBookMutation.isPending || updateBookMutation.isPending}
              >
                {createBookMutation.isPending || updateBookMutation.isPending
                  ? 'Saving...'
                  : editingBook
                  ? 'Update'
                  : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </AdminLayout>
    </ProtectedRoute>
  );
}

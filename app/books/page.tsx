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
  InputAdornment,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Visibility as SearchIcon,
  LibraryBooks,
  Person,
  Star,
  RateReview,
  Edit,
  Add,
  // Delete as DeleteIcon,
  // Add,
  // Refresh as ClearIcon,
  Home,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { useBooks, useDeleteBook } from '@/hooks/useBooks';
import { BookFilters } from '@/types/books';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BooksPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState<BookFilters>({
    page: 1,
    limit: 12,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Get user's own books
  const { data: myBooksResponse, isLoading: myBooksLoading, error: myBooksError } = useBooks({
    ...filters,
    createdBy: user?.id,
  });

  // Get all other books
  const { data: otherBooksResponse, isLoading: otherBooksLoading, error: otherBooksError } = useBooks({
    ...filters,
    excludeCreatedBy: user?.id,
  });

  const deleteBookMutation = useDeleteBook();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchTerm('');
    setFilters({
      page: 1,
      limit: 12,
    });
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
      limit: 12,
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleViewBook = (bookId: number) => {
    router.push(`/books/${bookId}`);
  };

  const handleEditBook = (bookId: number) => {
    router.push(`/books/${bookId}/edit`);
  };

  const handleDeleteBook = (bookId: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBookMutation.mutate(bookId);
    }
  };

  const handleAddBook = () => {
    router.push('/add-book');
  };

  const myBooks = myBooksResponse?.data || [];
  const otherBooks = otherBooksResponse?.data || [];
  const myBooksTotalPages = myBooksResponse?.totalPages || 0;
  const otherBooksTotalPages = otherBooksResponse?.totalPages || 0;

  const renderBookCard = (book: any, isMyBook: boolean = false) => (
    <Card
      key={book.id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          borderColor: 'primary.main',
          '& .book-cover': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Avatar 
            className="book-cover"
            sx={{ 
              bgcolor: 'primary.main', 
              mr: 2, 
              width: 56, 
              height: 56,
              transition: 'transform 0.3s ease',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
          >
            <LibraryBooks sx={{ fontSize: 28 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              fontWeight="700" 
              sx={{ 
                mb: 0.5,
                background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {book.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              by {book.author}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`ISBN: ${book.isbn}`}
            size="small"
            variant="outlined"
            sx={{ 
              mb: 1,
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderColor: 'primary.main',
              color: 'primary.main',
              fontWeight: 500
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Added by {book.creator.firstName} {book.creator.lastName}
          </Typography>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {new Date(book.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 3, pt: 0, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleViewBook(book.id)}
          startIcon={<LibraryBooks />}
          size="small"
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            }
          }}
        >
          View Details
        </Button>
        {isMyBook && (
          <>
            <Tooltip title="Edit Book">
              <IconButton
                size="small"
                onClick={() => handleEditBook(book.id)}
                color="primary"
                sx={{
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                  }
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Book">
              <IconButton
                size="small"
                onClick={() => handleDeleteBook(book.id)}
                color="error"
                sx={{
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </Card>
  );

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '100vh' }}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    fontWeight="800" 
                    gutterBottom
                    sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    Books
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                    Manage your book collection and discover amazing reads from others
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddBook}
                  sx={{ 
                    minWidth: 160,
                    height: 48,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    }
                  }}
                >
                  Add New Book
                </Button>
              </Box>
            </Box>

            {/* Tabs */}
            <Paper 
              sx={{ 
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 2,
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              >
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LibraryBooks />
                      <span>My Books</span>
                      <Chip 
                        label={myBooks.length} 
                        size="small" 
                        color="primary" 
                        sx={{ minWidth: 24, height: 24 }}
                      />
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Home />
                      <span>Browse Books</span>
                      <Chip 
                        label={otherBooks.length} 
                        size="small" 
                        color="secondary" 
                        sx={{ minWidth: 24, height: 24 }}
                      />
                    </Box>
                  } 
                />
              </Tabs>
            </Paper>

            {/* Filters */}
            <Card 
              sx={{ 
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    placeholder="Search by title, author, or ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      minWidth: 300,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    startIcon={<ClearIcon />}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Clear
                  </Button>
                  <FormControl sx={{ minWidth: 140 }}>
                    <InputLabel>Per Page</InputLabel>
                    <Select
                      value={filters.limit || 12}
                      label="Per Page"
                      onChange={(e) => setFilters(prev => ({ ...prev, limit: e.target.value as number, page: 1 }))}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value={6}>6 per page</MenuItem>
                      <MenuItem value={12}>12 per page</MenuItem>
                      <MenuItem value={24}>24 per page</MenuItem>
                      <MenuItem value={48}>48 per page</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>

            {/* My Books Tab */}
            <TabPanel value={tabValue} index={0}>
              {myBooksLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : myBooksError ? (
                <Alert severity="error">
                  Failed to load your books. Please try again.
                </Alert>
              ) : (
                <>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)',
                    },
                    gap: 3 
                  }}>
                    {myBooks.map((book) => renderBookCard(book, true))}
                  </Box>
                  
                  {myBooks.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                        }}
                      >
                        <LibraryBooks sx={{ fontSize: 48, color: 'white' }} />
                      </Box>
                      <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                        No books found
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                        You haven't added any books yet. Start building your collection and share your favorite reads with others!
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddBook}
                        size="large"
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          }
                        }}
                      >
                        Add Your First Book
                      </Button>
                    </Box>
                  )}
                  
                  {myBooksTotalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination
                        count={myBooksTotalPages}
                        page={filters.page || 1}
                        onChange={handlePageChange}
                        color="primary"
                      />
                    </Box>
                  )}
                </>
              )}
            </TabPanel>

            {/* Browse Books Tab */}
            <TabPanel value={tabValue} index={1}>
              {otherBooksLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : otherBooksError ? (
                <Alert severity="error">
                  Failed to load books. Please try again.
                </Alert>
              ) : (
                <>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)',
                    },
                    gap: 3 
                  }}>
                    {otherBooks.map((book) => renderBookCard(book, false))}
                  </Box>
                  
                  {otherBooks.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <LibraryBooks sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No books found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search criteria
                      </Typography>
                    </Box>
                  )}
                  
                  {otherBooksTotalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination
                        count={otherBooksTotalPages}
                        page={filters.page || 1}
                        onChange={handlePageChange}
                        color="primary"
                      />
                    </Box>
                  )}
                </>
              )}
            </TabPanel>
          </Container>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
}
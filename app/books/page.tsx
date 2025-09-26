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
import AddBookModal from '@/components/AddBookModal';
import EditBookModal from '@/components/EditBookModal';
import DeleteBookDialog from '@/components/DeleteBookDialog';
import { useBooks, useMyBooks } from '@/hooks/useBooks';
import { BookFilters, Book } from '@/types/books';
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
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);
  const [editBookModalOpen, setEditBookModalOpen] = useState(false);
  const [deleteBookDialogOpen, setDeleteBookDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Get user's own books
  const { data: myBooksResponse, isLoading: myBooksLoading, error: myBooksError } = useMyBooks(filters);

  // Get all books (including user's own books)
  const { data: allBooksResponse, isLoading: allBooksLoading, error: allBooksError } = useBooks(filters);

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

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setEditBookModalOpen(true);
  };

  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book);
    setDeleteBookDialogOpen(true);
  };

  const handleAddBook = () => {
    setAddBookModalOpen(true);
  };

  const myBooks = myBooksResponse?.data || [];
  const allBooks = allBooksResponse?.data || [];
  const myBooksTotalPages = myBooksResponse?.totalPages || 0;
  const allBooksTotalPages = allBooksResponse?.totalPages || 0;
  
  // Filter out user's own books from all books for the "Browse Books" tab
  const otherBooks = allBooks.filter(book => book.createdBy !== user?.id);

  const renderBookCard = (book: any, isMyBook: boolean = false) => (
    <Card
      key={book.id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 4,
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          '& .book-cover': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .book-title': {
            color: 'primary.main',
          },
          '& .book-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        },
      }}
    >
      {/* Book Cover Section */}
      <Box
        sx={{
          position: 'relative',
          height: 200,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          className="book-cover"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            transition: 'all 0.4s ease',
          }}
        />
        <LibraryBooks 
          sx={{ 
            fontSize: 64, 
            color: 'white',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            transition: 'all 0.4s ease',
          }} 
        />
        
        {/* Floating Action Buttons */}
        <Box 
          className="book-actions"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 1,
            opacity: 0,
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease',
          }}
        >
          {isMyBook && (
            <>
              <Tooltip title="Edit Book">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditBook(book);
                  }}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'white',
                      transform: 'scale(1.1)',
                    },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Book">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBook(book);
                  }}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'white',
                      transform: 'scale(1.1)',
                    },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

      {/* Book Content */}
      <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
        {/* Book Title */}
        <Typography 
          className="book-title"
          variant="h6" 
          component="h3" 
          fontWeight="700" 
          sx={{ 
            mb: 1,
            color: 'text.primary',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            transition: 'color 0.3s ease',
          }}
        >
          {book.title}
        </Typography>
        
        {/* Author */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontWeight: 500,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Person sx={{ fontSize: 16 }} />
          by {book.author}
        </Typography>
        
        {/* ISBN Chip */}
        <Chip
          label={`ISBN: ${book.isbn}`}
          size="small"
          variant="outlined"
          sx={{ 
            mb: 2,
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
            borderColor: 'primary.main',
            color: 'primary.main',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 24,
          }}
        />
        
        {/* Creator Info */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          p: 1.5,
          backgroundColor: 'rgba(0,0,0,0.02)',
          borderRadius: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
              <Person sx={{ fontSize: 14 }} />
            </Avatar>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {book.creator.firstName} {book.creator.lastName}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {new Date(book.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
      
      {/* Action Button */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleViewBook(book.id)}
          startIcon={<LibraryBooks />}
          sx={{
            borderRadius: 3,
            py: 1.5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.95rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );

  return (
    <ProtectedRoute>
      <Layout onAddBook={handleAddBook}>
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

            {/* Enhanced Search & Filters */}
            <Card 
              sx={{ 
                mb: 4,
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: 'none',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                    🔍 Search & Filter Books
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find your next great read with our powerful search tools
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
                    <TextField
                      fullWidth
                      placeholder="Search by title, author, or ISBN..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchTerm('')}
                              sx={{ color: 'text.secondary' }}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                          }
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      startIcon={<SearchIcon />}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Search
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={handleClearFilters}
                      startIcon={<ClearIcon />}
                      sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1.5,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          backgroundColor: 'rgba(102, 126, 234, 0.08)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Clear
                    </Button>
                    
                    <FormControl sx={{ minWidth: 160 }}>
                      <InputLabel sx={{ color: 'text.secondary' }}>Items per page</InputLabel>
                      <Select
                        value={filters.limit || 12}
                        label="Items per page"
                        onChange={(e) => setFilters(prev => ({ ...prev, limit: e.target.value as number, page: 1 }))}
                        sx={{ 
                          borderRadius: 3,
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <MenuItem value={6}>6 per page</MenuItem>
                        <MenuItem value={12}>12 per page</MenuItem>
                        <MenuItem value={24}>24 per page</MenuItem>
                        <MenuItem value={48}>48 per page</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
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
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                      xl: 'repeat(4, 1fr)',
                    },
                    gap: 4,
                    px: 1
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
              {allBooksLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : allBooksError ? (
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
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                      xl: 'repeat(4, 1fr)',
                    },
                    gap: 4,
                    px: 1
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
                  
                  {allBooksTotalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination
                        count={allBooksTotalPages}
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
        
        {/* Add Book Modal */}
        <AddBookModal 
          open={addBookModalOpen} 
          onClose={() => setAddBookModalOpen(false)} 
        />
        
        {/* Edit Book Modal */}
        <EditBookModal 
          open={editBookModalOpen} 
          onClose={() => {
            setEditBookModalOpen(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
        />
        
        {/* Delete Book Dialog */}
        <DeleteBookDialog 
          open={deleteBookDialogOpen} 
          onClose={() => {
            setDeleteBookDialogOpen(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
        />
      </Layout>
    </ProtectedRoute>
  );
}
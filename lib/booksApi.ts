import api from './api';
import { Book, BooksResponse, CreateBookData, UpdateBookData, BookFilters } from '@/types/books';

export const booksAPI = {
  // Get all books (public endpoint)
  getBooks: async (filters: BookFilters = {}): Promise<BooksResponse> => {
    const params = new URLSearchParams();
    
    if (filters.title) params.append('title', filters.title);
    if (filters.author) params.append('author', filters.author);
    if (filters.isbn) params.append('isbn', filters.isbn);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/books?${params.toString()}`);
    return response.data;
  },

  // Get only logged-in user's books (private endpoint)
  getMyBooks: async (filters: BookFilters = {}): Promise<BooksResponse> => {
    const params = new URLSearchParams();
    
    if (filters.title) params.append('title', filters.title);
    if (filters.author) params.append('author', filters.author);
    if (filters.isbn) params.append('isbn', filters.isbn);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/books/my-books?${params.toString()}`);
    return response.data;
  },

  // Get book by ID
  getBook: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Create new book
  createBook: async (bookData: CreateBookData): Promise<Book> => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  // Update book
  updateBook: async (id: number, bookData: UpdateBookData): Promise<Book> => {
    const response = await api.patch(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete book
  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  // Bulk delete books
  bulkDeleteBooks: async (bookIds: number[]): Promise<void> => {
    await api.delete('/books/bulk', {
      data: { bookIds }
    });
  },
};

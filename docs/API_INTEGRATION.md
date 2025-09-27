# 🌐 API Integration Documentation

## Overview
This document describes the API integration patterns, data flow, and error handling strategies used in the Book Management Portal Frontend.

## 🎯 API Architecture

### **1. Centralized API Configuration**
All API calls are centralized through a single Axios instance with consistent configuration.

```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **2. Service Layer Pattern**
API calls are organized into service modules by domain.

```
lib/
├── api.ts              # Base Axios configuration
├── booksApi.ts         # Book-related API calls
├── usersApi.ts         # User management API calls
├── feedbackApi.ts      # Review/feedback API calls
└── authStorage.ts      # Authentication utilities
```

## 🔄 Data Flow Architecture

### **1. Request Flow**
```
Component → Custom Hook → API Service → Axios → Backend → Response → State Update → UI Update
```

### **2. Response Flow**
```
Backend → Axios Interceptor → API Service → Custom Hook → Component State → UI Re-render
```

## 🛠️ API Service Implementation

### **1. Books API Service**
```typescript
// lib/booksApi.ts
export const booksAPI = {
  // Get all books with pagination and filtering
  getAllBooks: async (params?: BookFilters): Promise<BooksResponse> => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  // Get single book by ID
  getBookById: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Create new book
  createBook: async (data: CreateBookData): Promise<Book> => {
    const response = await api.post('/books', data);
    return response.data;
  },

  // Update existing book
  updateBook: async (id: number, data: UpdateBookData): Promise<Book> => {
    const response = await api.put(`/books/${id}`, data);
    return response.data;
  },

  // Delete book
  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  // Bulk delete books
  bulkDeleteBooks: async (bookIds: number[]): Promise<void> => {
    await api.delete('/books/bulk', { data: { bookIds } });
  },
};
```

### **2. Authentication API Service**
```typescript
// lib/api.ts
export const authAPI = {
  // User login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // User registration
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateUserData): Promise<User> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};
```

## 🔐 Authentication Integration

### **1. Token Management**
```typescript
// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      clearAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### **2. Server Actions Integration**
```typescript
// lib/auth-actions.ts
'use server';

import { cookies } from 'next/headers';

export async function setAuthToken(token: string) {
  cookies().set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAuthToken() {
  return cookies().get('authToken')?.value;
}

export async function clearAuthToken() {
  cookies().delete('authToken');
}
```

## 🎣 Custom Hooks for API Integration

### **1. Data Fetching Hooks**
```typescript
// hooks/useBooks.ts
export function useBooks(filters?: BookFilters) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => booksAPI.getAllBooks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksAPI.getBookById(id),
    enabled: !!id,
  });
}
```

### **2. Mutation Hooks**
```typescript
// hooks/useBooks.ts
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: booksAPI.createBook,
    onSuccess: (newBook) => {
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: ['books'] });
      
      // Add new book to cache
      queryClient.setQueryData(['book', newBook.id], newBook);
    },
    onError: (error) => {
      console.error('Failed to create book:', error);
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookData }) =>
      booksAPI.updateBook(id, data),
    onSuccess: (updatedBook) => {
      // Update book in cache
      queryClient.setQueryData(['book', updatedBook.id], updatedBook);
      
      // Invalidate books list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
```

## 🔄 State Management Integration

### **1. TanStack Query Configuration**
```typescript
// lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error.response?.status >= 400 && error.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
```

### **2. Query Key Management**
```typescript
// lib/queryKeys.ts
export const queryKeys = {
  books: {
    all: ['books'] as const,
    lists: () => [...queryKeys.books.all, 'list'] as const,
    list: (filters: BookFilters) => [...queryKeys.books.lists(), filters] as const,
    details: () => [...queryKeys.books.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.books.details(), id] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
};
```

## ⚠️ Error Handling Strategy

### **1. API Error Types**
```typescript
// types/api.ts
export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
  details?: Record<string, any>;
}

export interface ValidationError extends ApiError {
  statusCode: 400;
  details: {
    field: string;
    message: string;
  }[];
}
```

### **2. Error Handling in Hooks**
```typescript
// hooks/useBooks.ts
export function useCreateBook() {
  return useMutation({
    mutationFn: booksAPI.createBook,
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message || 'Failed to create book';
      
      // Show user-friendly error message
      toast.error(errorMessage);
      
      // Log error for debugging
      console.error('Create book error:', error);
    },
  });
}
```

### **3. Global Error Handling**
```typescript
// lib/api.ts
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    
    // Handle specific error codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - redirect to login
        clearAuthToken();
        window.location.href = '/login';
        break;
      case 403:
        // Forbidden - show access denied message
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        // Not found - show not found message
        toast.error('The requested resource was not found');
        break;
      case 429:
        // Rate limited - show rate limit message
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        // Server error - show generic error message
        toast.error('Server error. Please try again later.');
        break;
      default:
        // Generic error
        toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);
```

## 🔄 Optimistic Updates

### **1. Optimistic UI Updates**
```typescript
// hooks/useBooks.ts
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: booksAPI.createBook,
    onMutate: async (newBook) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['books'] });

      // Snapshot previous value
      const previousBooks = queryClient.getQueryData(['books']);

      // Optimistically update cache
      queryClient.setQueryData(['books'], (old: Book[]) => [
        ...old,
        { ...newBook, id: Date.now(), isOptimistic: true }
      ]);

      return { previousBooks };
    },
    onError: (err, newBook, context) => {
      // Rollback on error
      queryClient.setQueryData(['books'], context?.previousBooks);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
```

## 📊 Data Transformation

### **1. Response Data Transformation**
```typescript
// lib/booksApi.ts
export const booksAPI = {
  getAllBooks: async (params?: BookFilters): Promise<BooksResponse> => {
    const response = await api.get('/books', { params });
    
    // Transform response data
    return {
      books: response.data.books.map(transformBook),
      pagination: {
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
      },
    };
  },
};

function transformBook(book: any): Book {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    description: book.description,
    createdAt: new Date(book.createdAt),
    updatedAt: new Date(book.updatedAt),
    createdBy: {
      id: book.createdBy.id,
      firstName: book.createdBy.firstName,
      lastName: book.createdBy.lastName,
      email: book.createdBy.email,
    },
  };
}
```

## 🔄 Cache Management

### **1. Cache Invalidation Strategies**
```typescript
// hooks/useBooks.ts
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: booksAPI.createBook,
    onSuccess: () => {
      // Invalidate all book-related queries
      queryClient.invalidateQueries({ queryKey: ['books'] });
      
      // Invalidate user's books if applicable
      queryClient.invalidateQueries({ queryKey: ['my-books'] });
    },
  });
}
```

### **2. Background Refetching**
```typescript
// hooks/useBooks.ts
export function useBooks(filters?: BookFilters) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => booksAPI.getAllBooks(filters),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
```

## 🧪 Testing API Integration

### **1. Mock API Responses**
```typescript
// __tests__/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/books', (req, res, ctx) => {
    return res(
      ctx.json({
        books: [
          { id: 1, title: 'Test Book', author: 'Test Author' },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      })
    );
  }),
];
```

### **2. Testing Custom Hooks**
```typescript
// __tests__/hooks/useBooks.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBooks } from '@/hooks/useBooks';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useBooks', () => {
  it('should fetch books successfully', async () => {
    const { result } = renderHook(() => useBooks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.books).toHaveLength(1);
  });
});
```

## 📈 Performance Optimizations

### **1. Request Deduplication**
TanStack Query automatically deduplicates identical requests, preventing multiple API calls for the same data.

### **2. Background Updates**
```typescript
// lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 5 * 60 * 1000,
    },
  },
});
```

### **3. Pagination and Virtualization**
```typescript
// hooks/useBooks.ts
export function useBooks(filters: BookFilters & { page: number; limit: number }) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => booksAPI.getAllBooks(filters),
    keepPreviousData: true, // Keep previous data while fetching new page
  });
}
```

---

**This API integration architecture provides a robust, scalable, and maintainable approach to handling server communication while ensuring excellent user experience and developer productivity.**

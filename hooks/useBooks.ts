import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksAPI } from '@/lib/booksApi';
import { Book, CreateBookData, UpdateBookData, BookFilters } from '@/types/books';

// Query keys
export const booksKeys = {
  all: ['books'] as const,
  lists: () => [...booksKeys.all, 'list'] as const,
  list: (filters: BookFilters) => [...booksKeys.lists(), filters] as const,
  details: () => [...booksKeys.all, 'detail'] as const,
  detail: (id: number) => [...booksKeys.details(), id] as const,
};

// Hook for getting books with filters
export function useBooks(filters: BookFilters = {}) {
  return useQuery({
    queryKey: booksKeys.list(filters),
    queryFn: () => booksAPI.getBooks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for getting a single book
export function useBook(id: number) {
  return useQuery({
    queryKey: booksKeys.detail(id),
    queryFn: () => booksAPI.getBook(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for creating a book
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData: CreateBookData) => booksAPI.createBook(bookData),
    onSuccess: () => {
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}

// Hook for updating a book
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookData }) =>
      booksAPI.updateBook(id, data),
    onSuccess: (updatedBook) => {
      // Update the specific book in cache
      queryClient.setQueryData(booksKeys.detail(updatedBook.id), updatedBook);
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}

// Hook for deleting a book
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => booksAPI.deleteBook(id),
    onSuccess: (_, deletedId) => {
      // Remove the book from cache
      queryClient.removeQueries({ queryKey: booksKeys.detail(deletedId) });
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}

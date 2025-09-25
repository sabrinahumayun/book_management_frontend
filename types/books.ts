export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  creator: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface BooksResponse {
  data: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBookData {
  title: string;
  author: string;
  isbn: string;
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  isbn?: string;
}

export interface BookFilters {
  title?: string;
  author?: string;
  isbn?: string;
  page?: number;
  limit?: number;
  createdBy?: number;
  excludeCreatedBy?: number;
}

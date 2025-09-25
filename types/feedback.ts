export interface Feedback {
  id: number;
  rating: number;
  comment: string;
  bookId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
  };
}

export interface FeedbackResponse {
  data: Feedback[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateFeedbackData {
  rating: number;
  comment: string;
  bookId: number;
}

export interface UpdateFeedbackData {
  rating?: number;
  comment?: string;
}

export interface FeedbackFilters {
  bookId?: number;
  userId?: number;
  rating?: number;
  page?: number;
  limit?: number;
}

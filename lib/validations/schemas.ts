import { z } from 'zod';

// Book validation schema
export const bookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must not exceed 200 characters')
    .refine((val) => val.trim().length >= 2, 'Title cannot be empty or just spaces'),
  
  author: z
    .string()
    .min(1, 'Author is required')
    .min(2, 'Author must be at least 2 characters')
    .max(100, 'Author name must not exceed 100 characters')
    .refine((val) => val.trim().length >= 2, 'Author name cannot be empty or just spaces')
    .refine(
      (val) => /^[a-zA-Z\s\-'\.]+$/.test(val),
      'Author name can only contain letters, spaces, hyphens, apostrophes, and periods'
    ),
  
  isbn: z
    .string()
    .min(1, 'ISBN is required')
    .regex(/^[\d-]+$/, 'ISBN must contain only numbers and hyphens')
    .min(10, 'ISBN must be at least 10 characters')
    .max(17, 'ISBN must not exceed 17 characters')
    .refine((val) => {
      const cleanIsbn = val.replace(/-/g, '');
      return cleanIsbn.length === 10 || cleanIsbn.length === 13;
    }, 'ISBN must be 10 or 13 digits'),
});

// User validation schema
export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .refine((val) => val.trim().length >= 2, 'First name cannot be empty or just spaces'),
  
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .refine((val) => val.trim().length >= 2, 'Last name cannot be empty or just spaces'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  role: z.enum(['admin', 'user'], {
    message: 'Please select a valid role',
  }),
  
  isActive: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User update schema (without password)
export const userUpdateSchema = userSchema.omit({ password: true, confirmPassword: true });

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  password: z
    .string()
    .min(1, 'Password is required'),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .refine((val) => val.trim().length >= 2, 'First name cannot be empty or just spaces'),
  
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .refine((val) => val.trim().length >= 2, 'Last name cannot be empty or just spaces'),
});

// Feedback validation schema
export const feedbackSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating is required')
    .max(5, 'Rating must be between 1 and 5')
    .int('Rating must be a whole number'),
  
  comment: z
    .string()
    .min(1, 'Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must not exceed 1000 characters')
    .refine((val) => val.trim().length >= 10, 'Comment cannot be empty or just spaces'),
});

// Type exports for TypeScript inference
export type BookFormData = z.infer<typeof bookSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;

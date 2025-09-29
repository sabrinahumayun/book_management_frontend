import { z } from 'zod';

/**
 * Helper function to get user-friendly error messages from Zod validation errors
 */
export function getZodErrorMessage(error: z.ZodError): string {
  const firstError = error.issues[0];
  if (!firstError) return 'Validation failed';
  
  return firstError.message;
}

/**
 * Helper function to get field-specific error messages
 */
export function getZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    fieldErrors[path] = err.message;
  });
  
  return fieldErrors;
}

/**
 * Helper function to validate data against a schema and return formatted errors
 */
export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: getZodFieldErrors(error),
        message: getZodErrorMessage(error),
      };
    }
    return {
      success: false,
      message: 'Validation failed',
    };
  }
}

/**
 * Helper function to safely validate data and return success/error state
 */
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: z.ZodError;
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}

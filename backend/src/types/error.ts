export interface AppError extends Error {
  status?: number;
  code?: string;
} 
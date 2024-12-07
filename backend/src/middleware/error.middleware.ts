import { Request, Response, NextFunction } from 'express'

interface CustomError extends Error {
  status?: number;
  errors?: any[];
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)

  // Default error
  const status = err.status || 500
  const message = err.message || 'Terjadi kesalahan pada server'
  
  // Response
  res.status(status).json({
    success: false,
    message,
    errors: err.errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
} 
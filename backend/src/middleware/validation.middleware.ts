import { Request, Response, NextFunction } from 'express'
import { Schema } from 'zod'

export const validate = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error: any) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      })
    }
  }
} 
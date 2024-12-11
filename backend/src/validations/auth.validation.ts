import { z } from 'zod'

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter')
  })
})

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    name: z.string().min(3, 'Nama minimal 3 karakter')
  })
})

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6, 'Password lama minimal 6 karakter'),
    newPassword: z.string().min(6, 'Password baru minimal 6 karakter')
  })
})

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().min(6, 'Password minimal 6 karakter')
  })
}) 
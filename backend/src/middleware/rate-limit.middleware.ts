import rateLimit from 'express-rate-limit'

// Rate limit untuk API secara umum
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Terlalu banyak request, coba lagi nanti'
})

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: 'Terlalu banyak percobaan login, coba lagi nanti'
}) 
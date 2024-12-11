export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5002/api',
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
} as const 
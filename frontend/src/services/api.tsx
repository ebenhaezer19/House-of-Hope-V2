import axios from 'axios';

// Buat instance axios
export const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Tambahkan interface untuk response
interface AuthResponse {
  message: string;
  // tambahkan field lain jika ada
}

// Tambahkan token ke requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tambahkan interceptor untuk menangani error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Tambahkan notifikasi visual jika diperlukan
      console.warn('Rate limit reached:', error.response.data.message)
    }
    return Promise.reject(error)
  }
)

// Auth endpoints sebagai named exports
export const login = (email: string, password: string) => 
  api.post('/auth/login', { email, password });

export const getProfile = () => 
  api.get('/auth/me');

export const updateProfile = (data: any) =>
  api.put('/auth/profile', data);

export const changePassword = (data: any) =>
  api.post('/auth/change-password', data);

export const resetPassword = (data: { 
  token: string; 
  newPassword: string 
}): Promise<AuthResponse> => 
  api.post('/auth/reset-password', data);

export const forgotPassword = (data: { email: string }): Promise<AuthResponse> => 
  api.post('/auth/forgot-password', data); 
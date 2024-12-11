import axios from 'axios';

// Buat instance axios
export const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Tambahkan interface untuk response
interface AuthResponse {
  message: string;
}

// Tambahkan token ke requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints sebagai named exports
export const login = (email: string, password: string) => 
  api.post('/auth/login', { email, password });

export const getProfile = () => 
  api.get('/auth/me');

export const updateProfile = (data: any) =>
  api.put('/auth/profile', data);

export const changePassword = (data: any) =>
  api.post('/auth/change-password', data);

export const resetPassword = (data: { token: string; newPassword: string }) =>
  api.post('/auth/reset-password', data);

export const forgotPassword = (data: { email: string }): Promise<AuthResponse> => 
  api.post('/auth/forgot-password', data); 
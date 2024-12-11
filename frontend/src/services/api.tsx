import axios from 'axios';

// Definisikan interface untuk response login
interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// Definisikan interface untuk response umum
interface AuthResponse {
  message: string;
}

const API_URL = 'http://localhost:5001/api';

// Buat instance axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Tambahkan token ke requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error:', error);
      return Promise.reject({
        ...error,
        message: 'Tidak dapat terhubung ke server. Mohon cek koneksi Anda.'
      });
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export const getProfile = () => api.get('/auth/me');

export const updateProfile = (data: any) => api.put('/auth/profile', data);

export const changePassword = (data: any) => api.post('/auth/change-password', data);

export const resetPassword = (data: { token: string; newPassword: string }): Promise<AuthResponse> => 
  api.post('/auth/reset-password', data);

export const forgotPassword = async (data: { email: string }) => {
  try {
    const response = await api.post('/auth/forgot-password', data)
    return response
  } catch (error) {
    throw error
  }
} 
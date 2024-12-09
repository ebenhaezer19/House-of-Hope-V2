import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email: string, password: string) => 
  api.post('/auth/login', { email, password });

export const getProfile = () => 
  api.get('/auth/me');

export const updateProfile = (data: any) =>
  api.put('/auth/profile', data);

export const changePassword = (data: any) =>
  api.post('/auth/change-password', data); 
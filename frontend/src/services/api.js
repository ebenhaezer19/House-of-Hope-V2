import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth Services
export const login = (credentials) => api.post('/api/auth/login', credentials);
export const register = (userData) => api.post('/api/auth/register', userData);
export const changePassword = (data) => api.post('/api/auth/change-password', data);
export const forgotPassword = (email) => api.post('/api/auth/forgot-password', { email });
export const resetPassword = (data) => api.post('/api/auth/reset-password', data);

// Resident Services
export const getResidents = () => api.get('/api/residents');
export const getResident = (id) => api.get(`/api/residents/${id}`);
export const createResident = (data) => api.post('/api/residents', data);
export const updateResident = (id, data) => api.put(`/api/residents/${id}`, data);
export const deleteResident = (id) => api.delete(`/api/residents/${id}`);

// Room Services
export const getRooms = () => api.get('/api/rooms');
export const getRoom = (id) => api.get(`/api/rooms/${id}`);
export const createRoom = (data) => api.post('/api/rooms', data);
export const updateRoom = (id, data) => api.put(`/api/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/api/rooms/${id}`);

// Task Services
export const getTasks = () => api.get('/api/tasks');
export const getTask = (id) => api.get(`/api/tasks/${id}`);
export const createTask = (data) => api.post('/api/tasks', data);
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

// Interceptors
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;

import api from './api';

export const roomService = {
  // Get all rooms dengan filter dan pagination
  getAll: (params) => api.get('/rooms', { params }),
  
  // Get detail kamar
  getOne: (id) => api.get(`/rooms/${id}`),
  
  // Create kamar baru
  create: (data) => api.post('/rooms', data),
  
  // Update kamar
  update: (id, data) => api.put(`/rooms/${id}`, data),
  
  // Delete kamar
  delete: (id) => api.delete(`/rooms/${id}`),
  
  // Cek ketersediaan kamar
  checkAvailability: (id) => api.get(`/rooms/${id}/availability`)
}; 
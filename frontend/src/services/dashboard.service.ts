import axios from '../lib/axios'

export const DashboardService = {
  async getStats() {
    const response = await axios.get('/dashboard/stats')
    return response.data
  },

  async getResidentsByGender() {
    const response = await axios.get('/dashboard/residents-by-gender')
    return response.data
  },

  async getResidentsByEducation() {
    const response = await axios.get('/dashboard/residents-by-education')
    return response.data
  },

  async getRecentResidents() {
    const response = await axios.get('/dashboard/recent-residents')
    return response.data
  },

  async getRoomOccupancy() {
    const response = await axios.get('/dashboard/room-occupancy')
    return response.data
  }
} 
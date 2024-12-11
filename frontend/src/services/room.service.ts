import axios from '../lib/axios'

interface Room {
  id: number
  number: string
  type: 'MALE' | 'FEMALE'
  capacity: number
  status: string
  residents: Resident[]
}

interface Resident {
  id: number
  name: string
  education: string
}

// Ekspor fungsi-fungsi langsung
export const getAllRooms = async () => {
  try {
    console.log('Fetching rooms from API...')
    const response = await axios.get('/rooms')
    console.log('API Response:', response.data)

    const rooms = response.data
    if (!Array.isArray(rooms)) {
      console.error('Invalid response format:', rooms)
      return { MALE: [], FEMALE: [] }
    }

    return {
      MALE: rooms.filter(room => room.type === 'MALE'),
      FEMALE: rooms.filter(room => room.type === 'FEMALE')
    }
  } catch (error) {
    console.error('Error in getAllRooms:', error)
    throw error
  }
}

export const getRoom = async (id: number) => {
  const response = await axios.get(`/rooms/${id}`)
  return response.data
}

export const createRoom = async (data: Partial<Room>) => {
  const response = await axios.post('/rooms', data)
  return response.data
}

export const updateRoom = async (id: number, data: Partial<Room>) => {
  const response = await axios.put(`/rooms/${id}`, data)
  return response.data
}

export const deleteRoom = async (id: number) => {
  const response = await axios.delete(`/rooms/${id}`)
  return response.data
} 
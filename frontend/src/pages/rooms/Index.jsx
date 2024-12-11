import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'
import { roomService } from '../../services/room.service'
import LoadingSpinner from '../../components/LoadingSpinner'

const RoomManagement = () => {
  const [activeGender, setActiveGender] = useState('MALE')
  const [rooms, setRooms] = useState({ MALE: [], FEMALE: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        const response = await roomService.getAll()
        
        // Group rooms by gender
        const maleRooms = response.data.data.filter(room => room.type === 'MALE')
        const femaleRooms = response.data.data.filter(room => room.type === 'FEMALE')
        
        setRooms({
          MALE: maleRooms,
          FEMALE: femaleRooms
        })
        setError(null)
      } catch (err) {
        setError('Gagal memuat data kamar')
        console.error('Error fetching rooms:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  // Calculate stats
  const calculateStats = (roomList) => {
    return {
      total_rooms: roomList.length,
      total_occupants: roomList.reduce((sum, room) => sum + room.residents.length, 0),
      available_beds: roomList.reduce((sum, room) => sum + (room.capacity - room.residents.length), 0),
      maintenance: roomList.filter(room => room.status === 'maintenance').length || 0
    }
  }

  const stats = {
    MALE: calculateStats(rooms.MALE),
    FEMALE: calculateStats(rooms.FEMALE)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Coba lagi
          </button>
        </div>
      </div>
    )
  }

  const currentStats = stats[activeGender]

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Kamar</h1>
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <Link
            to="/rooms/map"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Lihat Denah
          </Link>
        </div>
      </div>

      {/* Gender Selector */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveGender('MALE')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeGender === 'MALE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kamar Laki-laki
          </button>
          <button
            onClick={() => setActiveGender('FEMALE')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeGender === 'FEMALE'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kamar Perempuan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HomeIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Kamar</dt>
                <dd className="text-2xl font-semibold text-gray-900">{currentStats.total_rooms}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Penghuni</dt>
                <dd className="text-2xl font-semibold text-gray-900">{currentStats.total_occupants}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HomeIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Tempat Tidur Tersedia</dt>
                <dd className="text-2xl font-semibold text-gray-900">{currentStats.available_beds}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Maintenance</dt>
                <dd className="text-2xl font-semibold text-gray-900">{currentStats.maintenance}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rooms[activeGender].map((room) => (
          <div
            key={room.id}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Kamar {room.number}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {room.residents.length}/{room.capacity} Penghuni
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  room.residents.length === room.capacity
                    ? 'bg-red-100 text-red-800'
                    : room.residents.length === 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {room.residents.length === room.capacity
                  ? 'Penuh'
                  : room.residents.length === 0
                  ? 'Kosong'
                  : 'Tersedia'}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Penghuni:</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {room.residents.map((resident) => (
                  <li key={resident.id} className="py-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resident.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {resident.education}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex space-x-2">
              <Link
                to={`/rooms/${room.id}`}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Detail
              </Link>
              <button
                type="button"
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                Atur Penghuni
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomManagement 
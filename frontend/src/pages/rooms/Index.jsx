import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HomeIcon,
  UserGroupIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'

const RoomManagement = () => {
  const [activeGender, setActiveGender] = useState('male') // 'male' atau 'female'
  
  // Data dummy untuk rooms
  const rooms = {
    male: [
      {
        id: 1,
        number: 'L-01',
        gender: 'male',
        capacity: 4,
        current_occupants: 3,
        status: 'occupied',
        type: 'regular',
        facilities: ['AC', 'Kamar Mandi Dalam'],
        occupants: [
          { id: 1, name: 'John Doe', education: 'SMA' },
          { id: 2, name: 'Mike Johnson', education: 'SMP' },
          { id: 3, name: 'Alex Brown', education: 'SD' }
        ]
      },
      {
        id: 2,
        number: 'L-02',
        gender: 'male',
        capacity: 4,
        current_occupants: 2,
        status: 'occupied',
        type: 'regular',
        facilities: ['AC', 'Kamar Mandi Dalam'],
        occupants: [
          { id: 4, name: 'David Wilson', education: 'SMA' },
          { id: 5, name: 'James Smith', education: 'SMP' }
        ]
      }
    ],
    female: [
      {
        id: 3,
        number: 'P-01',
        gender: 'female',
        capacity: 4,
        current_occupants: 3,
        status: 'occupied',
        type: 'regular',
        facilities: ['AC', 'Kamar Mandi Dalam'],
        occupants: [
          { id: 6, name: 'Jane Smith', education: 'SMA' },
          { id: 7, name: 'Emily Davis', education: 'SMP' },
          { id: 8, name: 'Sarah Wilson', education: 'SD' }
        ]
      },
      {
        id: 4,
        number: 'P-02',
        gender: 'female',
        capacity: 4,
        current_occupants: 2,
        status: 'occupied',
        type: 'regular',
        facilities: ['AC', 'Kamar Mandi Dalam'],
        occupants: [
          { id: 9, name: 'Emma Brown', education: 'SMA' },
          { id: 10, name: 'Sophia Lee', education: 'SMP' }
        ]
      }
    ]
  }

  const stats = {
    male: {
      total_rooms: 2,
      total_occupants: 5,
      available_beds: 3,
      maintenance: 0
    },
    female: {
      total_rooms: 2,
      total_occupants: 5,
      available_beds: 3,
      maintenance: 0
    }
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
            onClick={() => setActiveGender('male')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeGender === 'male'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kamar Laki-laki
          </button>
          <button
            onClick={() => setActiveGender('female')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeGender === 'female'
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
                  {room.current_occupants}/{room.capacity} Penghuni
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  room.current_occupants === room.capacity
                    ? 'bg-red-100 text-red-800'
                    : room.current_occupants === 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {room.current_occupants === room.capacity
                  ? 'Penuh'
                  : room.current_occupants === 0
                  ? 'Kosong'
                  : 'Tersedia'}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Penghuni:</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {room.occupants.map((occupant) => (
                  <li key={occupant.id} className="py-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {occupant.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {occupant.education}
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
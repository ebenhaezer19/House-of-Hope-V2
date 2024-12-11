import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PencilIcon, MapIcon } from '@heroicons/react/24/outline'

const RoomManagement = () => {
  const [rooms] = useState([
    { 
      id: 'L1', 
      name: 'Kamar Laki-laki 1', 
      gender: 'male', 
      capacity: 20,
      occupied: 12,
      floor: 1,
      type: 'WARD'
    },
    { 
      id: 'L2', 
      name: 'Kamar Laki-laki 2', 
      gender: 'male', 
      capacity: 20,
      occupied: 15,
      floor: 1,
      type: 'WARD'
    },
    { 
      id: 'P1', 
      name: 'Kamar Perempuan 1', 
      gender: 'female', 
      capacity: 20,
      occupied: 18,
      floor: 2,
      type: 'WARD'
    },
    { 
      id: 'P2', 
      name: 'Kamar Perempuan 2', 
      gender: 'female', 
      capacity: 20,
      occupied: 10,
      floor: 2,
      type: 'WARD'
    }
  ])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manajemen Kamar</h1>
        <Link
          to="/dashboard/rooms/map"
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div className="flex items-center">
            <MapIcon className="h-5 w-5 mr-2" />
            Peta Kamar
          </div>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Semua Lantai</option>
          <option value="1">Lantai 1</option>
          <option value="2">Lantai 2</option>
        </select>

        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Semua Gender</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>

        <input
          type="text"
          placeholder="Cari nama kamar..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Kamar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lantai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kapasitas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Terisi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.floor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.occupied}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    room.occupied < room.capacity
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {room.occupied < room.capacity ? 'Tersedia' : 'Penuh'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <Link
                      to={`/dashboard/rooms/${room.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RoomManagement 
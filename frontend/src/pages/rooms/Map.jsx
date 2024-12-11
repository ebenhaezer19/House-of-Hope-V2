import { useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const RoomMap = () => {
  const [activeFloor, setActiveFloor] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState(null)

  // Data dummy untuk denah
  const floorPlan = {
    1: [
      { id: 101, status: 'occupied', position: 'translate-x-0' },
      { id: 102, status: 'available', position: 'translate-x-32' },
      { id: 103, status: 'maintenance', position: 'translate-x-64' },
      // ... tambahkan kamar lainnya
    ]
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/rooms"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Denah Kamar</h1>
        </div>
      </div>

      {/* Floor Selector */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex space-x-4">
          {[1, 2, 3].map((floor) => (
            <button
              key={floor}
              onClick={() => setActiveFloor(floor)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeFloor === floor
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lantai {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Plan */}
      <div className="bg-white shadow rounded-lg p-8">
        <div className="relative h-[600px] border-2 border-gray-200 rounded-lg">
          {/* Grid for rooms */}
          <div className="absolute inset-0 grid grid-cols-4 gap-4 p-4">
            {floorPlan[activeFloor]?.map((room) => (
              <div
                key={room.id}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                  room.status === 'occupied'
                    ? 'border-green-500 bg-green-50'
                    : room.status === 'available'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-red-500 bg-red-50'
                } ${room.position}`}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="text-center">
                  <span className="text-lg font-bold">Kamar {room.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900">
              Detail Kamar {selectedRoom.id}
            </h3>
            {/* Add room details here */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setSelectedRoom(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomMap 
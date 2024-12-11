import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const RoomMap = () => {
  const navigate = useNavigate()
  const [selectedRoom, setSelectedRoom] = useState(null)

  // Data kamar
  const rooms = [
    { id: 'L1', name: 'Kamar Laki-laki 1', gender: 'male', beds: Array(20).fill().map((_, i) => ({
      id: `L1-${i+1}`,
      occupied: Math.random() > 0.5, // Simulasi status ranjang
      resident: Math.random() > 0.5 ? 'John Doe' : null
    }))},
    { id: 'L2', name: 'Kamar Laki-laki 2', gender: 'male', beds: Array(20).fill().map((_, i) => ({
      id: `L2-${i+1}`,
      occupied: Math.random() > 0.5,
      resident: Math.random() > 0.5 ? 'John Doe' : null
    }))},
    { id: 'P1', name: 'Kamar Perempuan 1', gender: 'female', beds: Array(20).fill().map((_, i) => ({
      id: `P1-${i+1}`,
      occupied: Math.random() > 0.5,
      resident: Math.random() > 0.5 ? 'Jane Doe' : null
    }))},
    { id: 'P2', name: 'Kamar Perempuan 2', gender: 'female', beds: Array(20).fill().map((_, i) => ({
      id: `P2-${i+1}`,
      occupied: Math.random() > 0.5,
      resident: Math.random() > 0.5 ? 'Jane Doe' : null
    }))}
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard/rooms')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold">Peta Kamar</h1>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-center">
              {room.name}
            </h2>
            
            {/* Bed Grid */}
            <div className="grid grid-cols-5 gap-2">
              {room.beds.map((bed) => (
                <div
                  key={bed.id}
                  onClick={() => setSelectedRoom(bed)}
                  className={`
                    aspect-square rounded-lg border-2 p-2 cursor-pointer
                    transition-all duration-200 hover:scale-105
                    flex items-center justify-center text-sm font-medium
                    ${bed.occupied 
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-green-500 bg-green-50 text-green-700'
                    }
                  `}
                >
                  {bed.id.split('-')[1]}
                </div>
              ))}
            </div>

            {/* Room Stats */}
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <span>
                Terisi: {room.beds.filter(b => b.occupied).length} / 20
              </span>
              <span>
                Tersedia: {room.beds.filter(b => !b.occupied).length} ranjang
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bed Detail Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              Detail Ranjang {selectedRoom.id}
            </h3>
            <div className="space-y-2">
              <p>
                Status: {selectedRoom.occupied ? 'Terisi' : 'Tersedia'}
              </p>
              {selectedRoom.occupied && selectedRoom.resident && (
                <p>Penghuni: {selectedRoom.resident}</p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
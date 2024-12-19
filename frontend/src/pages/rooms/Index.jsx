import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Card } from '../../components/shared';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Gagal memuat data kamar');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manajemen Kamar</h1>
        <Link
          to="/dashboard/residents"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Daftar Penghuni
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="relative">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                room.availableSpace === 0 
                  ? 'bg-red-100 text-red-800' 
                  : room.occupancyRate > 80
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {room.availableSpace === 0 
                  ? 'Penuh' 
                  : `${room.availableSpace} tempat tersedia`}
              </span>
            </div>

            {/* Room Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Kamar {room.number}</h3>
              </div>

              {/* Capacity Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kapasitas:</span>
                  <span className="font-medium">{room.capacity} orang</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Terisi:</span>
                  <span className="font-medium">{room.occupancy} orang</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      room.occupancyRate >= 90 
                        ? 'bg-red-500'
                        : room.occupancyRate >= 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${room.occupancyRate}%` }}
                  />
                </div>
              </div>

              {/* Residents List */}
              <div>
                <h4 className="text-sm font-medium mb-2">Penghuni ({room.residents.length}):</h4>
                {room.residents.length > 0 ? (
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    {room.residents.map(resident => (
                      <li 
                        key={resident.id}
                        className="text-sm flex justify-between items-center p-1 hover:bg-gray-50 rounded"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{resident.name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(resident.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          resident.status === 'NEW' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {resident.statusLabel}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Belum ada penghuni
                  </p>
                )}
              </div>
            </div>

            {/* Tambahkan loading state */}
            {loading && (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomManagement; 
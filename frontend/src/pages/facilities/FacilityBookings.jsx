import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { Alert, Button } from '../../components/shared'

const FacilityBookings = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [facility, setFacility] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching facility data for ID:', id)
        const response = await api.get(`/api/facilities/${id}`)
        console.log('Facility data:', response.data)
        
        setFacility(response.data)

        // Filter dan format booking data
        const activeBookings = response.data.bookings
          ?.filter(booking => {
            const startTime = new Date(booking.startTime)
            const endTime = new Date(booking.endTime)
            const now = new Date()
            return startTime <= now && endTime >= now
          })
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)) || []

        console.log('Active bookings:', activeBookings)
        setBookings(activeBookings)
      } catch (error) {
        console.error('Error fetching facility bookings:', error)
        setError(
          error.response?.data?.message || 
          'Gagal memuat data booking. Silakan coba lagi.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <Alert type="error" message={error} />
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate('/dashboard/facilities')}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>
    )
  }

  if (!facility) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <Alert type="error" message="Fasilitas tidak ditemukan" />
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate('/dashboard/facilities')}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          className="mb-4"
          onClick={() => navigate('/dashboard/facilities')}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">
          Booking Aktif: {facility.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {facility.type} - Kapasitas {facility.capacity} orang
        </p>
      </div>

      {/* Booking List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {bookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Tidak ada booking aktif saat ini
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {booking.resident?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.purpose}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'approved' ? 'Disetujui' :
                         booking.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {new Date(booking.startTime).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                        {' - '}
                        {new Date(booking.endTime).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {booking.notes && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default FacilityBookings 
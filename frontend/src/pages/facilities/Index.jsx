import { useState, useEffect } from 'react'
import api from '../../services/api'
import { 
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import DetailModal from '../../components/facilities/DetailModal'
import BookingModal from '../../components/facilities/BookingModal'
import { Button } from '../../components/shared'
import MaintenanceModal from '../../components/facilities/MaintenanceModal'
import EditMaintenanceModal from '../../components/facilities/EditMaintenanceModal'
import BookingDetailModal from '../../components/facilities/BookingDetailModal'

const FacilityManagement = () => {
  const [activeTab, setActiveTab] = useState('facilities')
  const [facilities, setFacilities] = useState([])
  const [bookings, setBookings] = useState([])
  const [maintenanceLogs, setMaintenanceLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [selectedMaintenanceLog, setSelectedMaintenanceLog] = useState(null)
  const [showEditMaintenanceModal, setShowEditMaintenanceModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false)
  const navigate = useNavigate()

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  };

  const refreshData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/facilities')
      setFacilities(response.data)
      
      // Extract dan format booking data
      const currentBookings = response.data.flatMap(f => 
        f.bookings.map(b => ({
          ...b,
          facilityName: f.name,
          startTimeFormatted: formatDateTime(b.startTime),
          endTimeFormatted: formatDateTime(b.endTime)
        }))
      ).sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      
      setBookings(currentBookings)

      // Extract maintenance logs dengan format yang benar
      const currentMaintenance = response.data.flatMap(f =>
        (f.maintenanceLogs || []).map(m => ({
          ...m,
          id: m.id,
          facility: f.name,
          facilityId: f.id,
          startDate: new Date(m.startDate).toLocaleDateString('id-ID'),
          endDate: m.endDate ? new Date(m.endDate).toLocaleDateString('id-ID') : '-',
          type: m.type,
          description: m.description,
          status: m.status,
          notes: m.notes
        }))
      ).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

      console.log('Maintenance logs:', currentMaintenance)
      setMaintenanceLogs(currentMaintenance)
      setError(null)
    } catch (error) {
      console.error('Error refreshing data:', error)
      setError('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleDelete = async (facilityId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
      return;
    }

    try {
      await api.delete(`/api/facilities/${facilityId}`);
      refreshData(); // Refresh data setelah hapus
      setError(null);
    } catch (error) {
      console.error('Error deleting facility:', error);
      setError('Gagal menghapus fasilitas');
    }
  };

  // Tambahkan fungsi untuk menghitung booking aktif
  const getActiveBookingsCount = (facility) => {
    return facility.bookings?.filter(booking => 
      new Date(booking.startTime) <= new Date() && 
      new Date(booking.endTime) >= new Date()
    ).length || 0;
  };

  const handleEditMaintenance = (log) => {
    try {
      console.log('Original log:', log);

      // Helper function untuk parse tanggal Indonesia
      const parseIndonesianDate = (dateStr) => {
        // Format tanggal Indonesia: "21 Desember 2024"
        const months = {
          'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
          'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
          'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
        };

        const [day, month, year] = dateStr.split(' ');
        const monthNumber = months[month];
        
        // Format YYYY-MM-DD untuk input type="date"
        return `${year}-${monthNumber}-${day.padStart(2, '0')}`;
      };

      // Format log untuk form edit
      const formattedLog = {
        id: log.id,
        facilityId: log.facilityId,
        type: log.type,
        description: log.description,
        startDate: parseIndonesianDate(log.startDate),
        endDate: log.endDate !== '-' ? parseIndonesianDate(log.endDate) : '',
        status: log.status,
        notes: log.notes || ''
      };

      console.log('Formatted log for edit:', formattedLog);
      
      setSelectedMaintenanceLog(formattedLog);
      setShowEditMaintenanceModal(true);
    } catch (error) {
      console.error('Error formatting maintenance log:', error);
      setError('Gagal memformat data maintenance. Detail: ' + error.message);
    }
  };

  const handleDeleteMaintenance = async (logId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus log maintenance ini?')) {
      return
    }

    try {
      await api.delete(`/api/facilities/maintenance/${logId}`)
      refreshData() // Refresh data setelah hapus
      setError(null)
    } catch (error) {
      console.error('Error deleting maintenance log:', error)
      setError('Gagal menghapus log maintenance')
    }
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Fasilitas</h1>
        <div className="mt-4 sm:mt-0">
          <Link 
            to="/dashboard/facilities/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Tambah Fasilitas
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Fasilitas</dt>
                <dd className="text-2xl font-semibold text-gray-900">{facilities.length}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Booking Hari Ini</dt>
                <dd className="text-2xl font-semibold text-gray-900">{bookings.length}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WrenchScrewdriverIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Dalam Maintenance</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {facilities.filter(f => f.status === 'maintenance').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Tersedia</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {facilities.filter(f => f.status === 'available').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'facilities', name: 'Daftar Fasilitas' },
              { id: 'bookings', name: 'Booking' },
              { id: 'maintenance', name: 'Maintenance' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'facilities' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => (
                <div key={facility.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="relative">
                    <img
                      src={facility.image}
                      alt={facility.name}
                      className="w-full h-48 object-cover"
                    />
                    {/* Badge booking aktif yang bisa diklik */}
                    <button
                      onClick={() => navigate(`/dashboard/facilities/${facility.id}/bookings`)}
                      className="absolute top-2 right-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      <span className="font-bold mr-1">{getActiveBookingsCount(facility)}</span>
                      <span>Booking</span>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{facility.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{facility.type}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          facility.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : facility.status === 'maintenance'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {facility.status === 'available'
                            ? 'Tersedia'
                            : facility.status === 'maintenance'
                            ? 'Maintenance'
                            : 'Terpakai'}
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          Kapasitas: {facility.capacity} orang
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button 
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        onClick={() => {
                          setSelectedFacility(facility)
                          setShowDetailModal(true)
                        }}
                      >
                        Detail
                      </button>
                      <button 
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                        onClick={() => navigate(`/dashboard/facilities/${facility.id}/edit`)}
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button 
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                        onClick={() => handleDelete(facility.id)}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Hapus
                      </button>
                      <button 
                        className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded ${
                          facility.status === 'available'
                            ? 'text-gray-700 bg-white hover:bg-gray-50'
                            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          if (facility.status === 'available') {
                            setSelectedFacility(facility)
                            setShowBookingModal(true)
                          }
                        }}
                        disabled={facility.status !== 'available'}
                      >
                        Booking
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fasilitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penghuni
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Mulai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Selesai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tujuan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Belum ada data booking
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.facilityName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.resident?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.startTime).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.endTime).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {booking.purpose}
                          </div>
                          {booking.notes && (
                            <div className="text-xs text-gray-500">
                              {booking.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowBookingDetailModal(true)
                            }}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              {/* Tombol Tambah Log Maintenance */}
              <div className="mb-4">
                <Button
                  onClick={() => setShowMaintenanceModal(true)}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Tambah Log Maintenance
                </Button>
              </div>

              {/* Tabel Maintenance */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fasilitas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Mulai
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Selesai
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {maintenanceLogs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          Belum ada data maintenance
                        </td>
                      </tr>
                    ) : (
                      maintenanceLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {log.facility}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {log.type === 'routine' ? 'Rutin' : 'Perbaikan'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {log.description}
                            </div>
                            {log.notes && (
                              <div className="text-xs text-gray-500">
                                {log.notes}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {log.startDate}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {log.endDate}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              log.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : log.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {log.status === 'completed' ? 'Selesai' :
                               log.status === 'in_progress' ? 'Dalam Proses' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditMaintenance(log)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMaintenance(log.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedFacility && (
        <>
          <DetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false)
              setSelectedFacility(null)
            }}
            facility={selectedFacility}
          />
          <BookingModal
            isOpen={showBookingModal}
            onClose={() => {
              setShowBookingModal(false)
              setSelectedFacility(null)
            }}
            facility={selectedFacility}
            onSuccess={refreshData}
          />
        </>
      )}

      {/* Maintenance Modal - Pindahkan keluar dari selectedFacility */}
      <MaintenanceModal
        isOpen={showMaintenanceModal}
        onClose={() => {
          setShowMaintenanceModal(false)
        }}
        onSuccess={refreshData}
      />

      {/* Tambahkan EditMaintenanceModal */}
      <EditMaintenanceModal
        isOpen={showEditMaintenanceModal}
        onClose={() => {
          setShowEditMaintenanceModal(false)
          setSelectedMaintenanceLog(null)
        }}
        maintenanceLog={selectedMaintenanceLog}
        onSuccess={() => {
          refreshData()
          setShowEditMaintenanceModal(false)
          setSelectedMaintenanceLog(null)
        }}
      />

      {/* Tambahkan BookingDetailModal */}
      <BookingDetailModal
        isOpen={showBookingDetailModal}
        onClose={() => {
          setShowBookingDetailModal(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking}
      />
    </div>
  )
}

export default FacilityManagement 
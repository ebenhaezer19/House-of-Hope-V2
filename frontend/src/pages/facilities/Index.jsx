import { useState } from 'react'
import { 
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const FacilityManagement = () => {
  const [activeTab, setActiveTab] = useState('facilities') // facilities, bookings, maintenance

  const facilities = [
    {
      id: 1,
      name: 'Ruang Belajar',
      type: 'Study Room',
      capacity: 20,
      status: 'available',
      maintenance_schedule: 'Setiap Minggu',
      current_booking: null,
      image: 'https://placehold.co/300x200'
    },
    {
      id: 2,
      name: 'Ruang Komputer',
      type: 'Computer Lab',
      capacity: 15,
      status: 'maintenance',
      maintenance_schedule: 'Setiap Bulan',
      current_booking: null,
      image: 'https://placehold.co/300x200'
    },
    {
      id: 3,
      name: 'Aula',
      type: 'Multi-purpose Hall',
      capacity: 100,
      status: 'booked',
      maintenance_schedule: 'Setiap Bulan',
      current_booking: {
        user: 'John Doe',
        purpose: 'Acara Belajar Bersama',
        time: '14:00 - 16:00'
      },
      image: 'https://placehold.co/300x200'
    }
  ]

  const bookings = [
    {
      id: 1,
      facility: 'Aula',
      user: 'John Doe',
      date: '2024-03-15',
      time: '14:00 - 16:00',
      purpose: 'Acara Belajar Bersama',
      status: 'approved'
    }
  ]

  const maintenanceLogs = [
    {
      id: 1,
      facility: 'Ruang Komputer',
      type: 'Routine',
      date: '2024-03-14',
      description: 'Pembersihan dan pengecekan komputer',
      status: 'in_progress'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Fasilitas</h1>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Tambah Fasilitas
          </button>
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
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{facility.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{facility.type}</p>
                    <div className="mt-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                    </div>
                    {facility.current_booking && (
                      <div className="mt-4 text-sm text-gray-500">
                        <p>Digunakan oleh: {facility.current_booking.user}</p>
                        <p>Waktu: {facility.current_booking.time}</p>
                      </div>
                    )}
                    <div className="mt-4 flex space-x-2">
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                        Detail
                      </button>
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
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
                      Pengguna
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
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
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.facility}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {booking.status === 'approved' ? 'Disetujui' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'maintenance' && (
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
                      Tanggal
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
                  {maintenanceLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.facility}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {log.status === 'in_progress' ? 'Dalam Proses' : 'Selesai'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FacilityManagement 
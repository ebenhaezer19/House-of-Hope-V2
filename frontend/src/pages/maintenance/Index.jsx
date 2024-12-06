import { useState } from 'react'
import { 
  SparklesIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const MaintenanceManagement = () => {
  const [activeTab, setActiveTab] = useState('cleaning') // cleaning, maintenance, reports

  // Data dummy untuk jadwal kebersihan
  const cleaningSchedules = [
    {
      id: 1,
      area: 'Kamar L-01',
      assigned_to: 'John Doe',
      schedule_time: '08:00',
      status: 'completed',
      last_cleaned: '2024-03-15 08:30',
      next_schedule: '2024-03-16 08:00',
      checklist: [
        { item: 'Menyapu', done: true },
        { item: 'Mengepel', done: true },
        { item: 'Membersihkan jendela', done: true }
      ]
    },
    {
      id: 2,
      area: 'Kamar P-01',
      assigned_to: 'Jane Smith',
      schedule_time: '09:00',
      status: 'pending',
      last_cleaned: '2024-03-14 09:15',
      next_schedule: '2024-03-15 09:00',
      checklist: [
        { item: 'Menyapu', done: false },
        { item: 'Mengepel', done: false },
        { item: 'Membersihkan jendela', done: false }
      ]
    }
  ]

  // Data dummy untuk maintenance
  const maintenanceItems = [
    {
      id: 1,
      item: 'AC Kamar L-01',
      type: 'routine',
      priority: 'medium',
      status: 'scheduled',
      last_maintenance: '2024-02-15',
      next_maintenance: '2024-03-15',
      notes: 'Pembersihan filter dan pengecekan freon'
    },
    {
      id: 2,
      item: 'Pompa Air',
      type: 'repair',
      priority: 'high',
      status: 'in_progress',
      reported_date: '2024-03-14',
      assigned_to: 'Teknisi A',
      description: 'Pompa air tidak bekerja maksimal'
    }
  ]

  // Data dummy untuk laporan kebersihan
  const cleanlinessReports = [
    {
      id: 1,
      area: 'Kamar L-01',
      rating: 4,
      inspector: 'Admin',
      inspection_date: '2024-03-15',
      notes: 'Kondisi kamar sangat bersih',
      issues: []
    },
    {
      id: 2,
      area: 'Kamar P-01',
      rating: 2,
      inspector: 'Admin',
      inspection_date: '2024-03-15',
      notes: 'Perlu peningkatan kebersihan',
      issues: ['Lantai kotor', 'Jendela berdebu']
    }
  ]

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kebersihan & Maintenance</h1>
        <div className="mt-4 sm:mt-0 space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Tambah Jadwal
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Lapor Masalah
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Area Dibersihkan</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {cleaningSchedules.filter(s => s.status === 'completed').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Menunggu Pembersihan</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {cleaningSchedules.filter(s => s.status === 'pending').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WrenchScrewdriverIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Maintenance Aktif</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {maintenanceItems.filter(m => m.status === 'in_progress').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Masalah Dilaporkan</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {maintenanceItems.filter(m => m.type === 'repair').length}
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
              { id: 'cleaning', name: 'Jadwal Kebersihan' },
              { id: 'maintenance', name: 'Maintenance' },
              { id: 'reports', name: 'Laporan Kebersihan' }
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
          {/* Jadwal Kebersihan */}
          {activeTab === 'cleaning' && (
            <div className="space-y-6">
              {cleaningSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {schedule.area}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Petugas: {schedule.assigned_to}
                        </p>
                      </div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          schedule.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {schedule.status === 'completed' ? 'Selesai' : 'Menunggu'}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900">Checklist:</h4>
                      <ul className="mt-2 space-y-2">
                        {schedule.checklist.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircleIcon
                              className={`h-5 w-5 ${
                                item.done ? 'text-green-500' : 'text-gray-300'
                              }`}
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              {item.item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <p>Terakhir dibersihkan:</p>
                        <p className="font-medium text-gray-900">{schedule.last_cleaned}</p>
                      </div>
                      <div>
                        <p>Jadwal berikutnya:</p>
                        <p className="font-medium text-gray-900">{schedule.next_schedule}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Maintenance */}
          {activeTab === 'maintenance' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioritas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jadwal/Tanggal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maintenanceItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.item}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.type === 'routine'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.type === 'routine' ? 'Rutin' : 'Perbaikan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.priority === 'high' ? 'Tinggi' : 
                           item.priority === 'medium' ? 'Sedang' : 'Rendah'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status === 'completed' ? 'Selesai' :
                           item.status === 'in_progress' ? 'Dalam Proses' : 'Terjadwal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.next_maintenance || item.reported_date}
                        </div>
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

          {/* Laporan Kebersihan */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {cleanlinessReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {report.area}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Inspeksi oleh: {report.inspector}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`h-5 w-5 ${
                            index < report.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{report.notes}</p>
                  </div>

                  {report.issues.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Masalah:</h4>
                      <ul className="mt-2 space-y-1">
                        {report.issues.map((issue, index) => (
                          <li
                            key={index}
                            className="text-sm text-red-600 flex items-center"
                          >
                            <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 text-sm text-gray-500">
                    Tanggal Inspeksi: {report.inspection_date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MaintenanceManagement 
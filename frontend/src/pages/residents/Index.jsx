import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const Residents = () => {
  const [residents] = useState([
    {
      id: 1,
      name: 'John Doe',
      education: 'SMA',
      status: 'Aktif',
      gender: 'Laki-laki',
      birthDate: '2005-01-15',
      nik: '1234567890',
      birthplace: 'Jakarta',
      address: 'Jl. Contoh No. 123',
      phone: '08123456789',
      schoolName: 'SMA Negeri 1',
      parentName: 'Jane Doe',
      parentPhone: '08987654321'
    }
  ])

  const [selectedResident, setSelectedResident] = useState(null)
  const [viewMode, setViewMode] = useState('table')

  const handleViewDetail = (resident) => {
    setSelectedResident(resident)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Data Penghuni</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
          >
            {viewMode === 'table' ? 'Tampilan Grid' : 'Tampilan Tabel'}
          </button>
          <Link
            to="/dashboard/residents/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Tambah Penghuni
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Semua Jenjang</option>
          <option value="SD">SD</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
          <option value="Kuliah">Kuliah</option>
        </select>

        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Alumni">Alumni</option>
          <option value="Keluar">Keluar</option>
        </select>

        <input
          type="text"
          placeholder="Cari nama..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Conditional rendering berdasarkan viewMode */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendidikan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Kelamin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Lahir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {residents.map((resident) => (
                <tr key={resident.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.education}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      resident.status === 'Aktif' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {resident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(resident.birthDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/residents/${resident.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => {
                          // Handle delete
                          console.log('Delete resident:', resident.id)
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {residents.map((resident) => (
            <div key={resident.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{resident.name}</h3>
                  <p className="text-sm text-gray-500">{resident.education}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  resident.status === 'Aktif' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {resident.status}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">Gender: {resident.gender}</p>
                <p className="text-sm text-gray-600">
                  Tanggal Lahir: {new Date(resident.birthDate).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleViewDetail(resident)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">Detail Penghuni</h2>
              <button
                onClick={() => setSelectedResident(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                <p className="text-sm text-gray-900">{selectedResident.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">NIK</p>
                <p className="text-sm text-gray-900">{selectedResident.nik}</p>
              </div>
              {/* ... tambahkan field detail lainnya ... */}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedResident(null)}
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

export default Residents
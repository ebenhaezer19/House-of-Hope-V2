import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const Problems = () => {
  const [problems] = useState([
    {
      id: 1,
      title: 'Kebocoran di Kamar L1',
      reporter: 'John Doe',
      category: 'Fasilitas',
      priority: 'Tinggi',
      status: 'Open',
      reportDate: '2024-03-18',
      description: 'Ada kebocoran di langit-langit kamar L1 saat hujan'
    },
    {
      id: 2,
      title: 'AC Tidak Dingin',
      reporter: 'Jane Smith',
      category: 'Peralatan',
      priority: 'Sedang',
      status: 'In Progress',
      reportDate: '2024-03-17',
      description: 'AC di ruang belajar tidak dingin'
    },
    {
      id: 3,
      title: 'Masalah Akademik',
      reporter: 'Mike Johnson',
      category: 'Akademik',
      priority: 'Rendah',
      status: 'Closed',
      reportDate: '2024-03-16',
      description: 'Kesulitan dalam mengikuti pelajaran matematika'
    }
  ])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pelaporan Masalah</h1>
        <Link
          to="/dashboard/problems/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Laporkan Masalah
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Semua Kategori</option>
          <option value="Fasilitas">Fasilitas</option>
          <option value="Peralatan">Peralatan</option>
          <option value="Akademik">Akademik</option>
        </select>

        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Semua Prioritas</option>
          <option value="Tinggi">Tinggi</option>
          <option value="Sedang">Sedang</option>
          <option value="Rendah">Rendah</option>
        </select>

        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Semua Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="Cari masalah..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Problems Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pelapor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioritas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {problems.map((problem) => (
              <tr key={problem.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {problem.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {problem.reporter}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {problem.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    problem.priority === 'Tinggi' ? 'bg-red-100 text-red-800' :
                    problem.priority === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {problem.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    problem.status === 'Open' ? 'bg-red-100 text-red-800' :
                    problem.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {problem.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(problem.reportDate).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <Link
                      to={`/dashboard/problems/${problem.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => {
                        // Handle delete
                        console.log('Delete problem:', problem.id)
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
    </div>
  )
}

export default Problems
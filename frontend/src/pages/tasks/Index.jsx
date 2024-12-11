import { Link } from 'react-router-dom'
import TaskCalendar from '../../components/TaskCalendar'
import { useState } from 'react'

const Tasks = () => {
  // Data dummy untuk contoh
  const [tasks] = useState([
    {
      id: 1,
      resident_name: 'John Doe',
      gender: 'Laki-laki',
      class: 'SMA',
      task_type: 'Piket Harian',
      task_name: 'Membersihkan Ruang Makan',
      schedule_date: '2024-03-15',
      start_time: '08:00',
      end_time: '09:00',
      status: 'Pending'
    },
    {
      id: 2,
      resident_name: 'Jane Doe',
      gender: 'Perempuan',
      class: 'SMP',
      task_type: 'Pelayanan Sosial',
      task_name: 'Membantu Dapur',
      schedule_date: '2024-03-15',
      start_time: '10:00',
      end_time: '12:00',
      status: 'Completed'
    },
    // Tambahkan data dummy lainnya...
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Jadwal & Tugas</h1>
        <Link
          to="/tasks/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Tambah Tugas
        </Link>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="">Semua Jenis Tugas</option>
            <option value="Piket Harian">Piket Harian</option>
            <option value="Pelayanan Sosial">Pelayanan Sosial</option>
            <option value="Kegiatan Khusus">Kegiatan Khusus</option>
          </select>
          <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="date"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Cari nama penghuni..."
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Kalender Tugas</h2>
        <TaskCalendar events={tasks} />
      </div>

      {/* Table View */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Penghuni
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis Tugas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Tugas
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
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task.resident_name}</div>
                  <div className="text-sm text-gray-500">{task.class}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.task_type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.task_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.schedule_date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {/* Handle delete */}}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Tasks 
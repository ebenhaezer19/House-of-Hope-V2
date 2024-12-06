import { useState } from 'react'
import { 
  UserGroupIcon, 
  ExclamationCircleIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week')

  const stats = [
    {
      name: 'Total Penghuni',
      stat: '100',
      icon: UserGroupIcon,
      change: '12%',
      changeType: 'increase',
      details: {
        TK: 15,
        SD: 30,
        SMP: 25,
        SMA: 20,
        Kuliah: 10
      }
    },
    {
      name: 'Masalah Aktif',
      stat: '12',
      icon: ExclamationCircleIcon,
      change: '2%',
      changeType: 'decrease',
      details: {
        Akademik: 5,
        Perilaku: 3,
        Kesehatan: 2,
        Keluarga: 2
      }
    },
    {
      name: 'Tugas Hari Ini',
      stat: '8',
      icon: ClipboardDocumentListIcon,
      change: '5%',
      changeType: 'increase',
      details: {
        'Piket Harian': 4,
        'Pelayanan Sosial': 2,
        'Kegiatan Khusus': 2
      }
    }
  ]

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Penghuni Baru',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
      },
      {
        label: 'Alumni',
        data: [2, 3, 1, 4, 2, 1],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      }
    ]
  }

  const recentActivities = [
    {
      id: 1,
      name: 'John Doe',
      activity: 'Menyelesaikan tugas piket',
      time: '2 jam yang lalu',
      icon: ClipboardDocumentListIcon,
      iconBackground: 'bg-green-500'
    },
    {
      id: 2,
      name: 'Jane Smith',
      activity: 'Melaporkan masalah akademik',
      time: '4 jam yang lalu',
      icon: ExclamationCircleIcon,
      iconBackground: 'bg-yellow-500'
    },
    // Tambahkan aktivitas lainnya...
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-3 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="day">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${
                item.changeType === 'increase' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon className="self-center flex-shrink-0 h-5 w-5" aria-hidden="true" />
                ) : (
                  <ArrowDownIcon className="self-center flex-shrink-0 h-5 w-5" aria-hidden="true" />
                )}
                <span className="ml-1">{item.change}</span>
              </p>
            </dd>
            <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Lihat Detail<span className="sr-only"> {item.name}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistik Penghuni</h3>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: false
                }
              }
            }}
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Aktivitas Terbaru</h3>
            <div className="flow-root mt-6">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 rounded-md p-2 ${activity.iconBackground}`}>
                        <activity.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.activity}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="#"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Lihat Semua
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 
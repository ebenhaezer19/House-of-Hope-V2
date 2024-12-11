import React from 'react'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UserGroupIcon, ExclamationCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalResidents: 100,
    activeProblems: 12,
    todayTasks: 8,
    residentStats: [
      { month: 'Jan', residents: 12, alumni: 2 },
      { month: 'Feb', residents: 18, alumni: 3 },
      { month: 'Mar', residents: 3, alumni: 1 },
      { month: 'Apr', residents: 5, alumni: 4 },
      { month: 'May', residents: 2, alumni: 2 },
      { month: 'Jun', residents: 3, alumni: 1 }
    ],
    recentActivities: [
      { id: 1, user: 'John Doe', action: 'Menyelesaikan tugas piket', timestamp: '2 jam yang lalu' },
      { id: 2, user: 'Jane Smith', action: 'Melaporkan masalah akademik', timestamp: '4 jam yang lalu' }
    ]
  })

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Penghuni"
          value={stats.totalResidents}
          change={12}
          trend="up"
          icon={<UserGroupIcon className="h-6 w-6 text-white" />}
          color="bg-emerald-500"
        />
        <StatCard
          title="Masalah Aktif"
          value={stats.activeProblems}
          change={2}
          trend="down"
          icon={<ExclamationCircleIcon className="h-6 w-6 text-white" />}
          color="bg-red-500"
        />
        <StatCard
          title="Tugas Hari Ini"
          value={stats.todayTasks}
          change={5}
          trend="up"
          icon={<ClipboardDocumentListIcon className="h-6 w-6 text-white" />}
          color="bg-emerald-500"
        />
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resident Statistics Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Statistik Penghuni</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.residentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="residents" name="Penghuni Baru" fill="#818CF8" />
                <Bar dataKey="alumni" name="Alumni" fill="#34D399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Aktivitas Terbaru</h2>
            <button className="text-indigo-600 hover:text-indigo-800">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {stats.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserGroupIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.action}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {activity.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// StatCard Component
const StatCard = ({ title, value, change, trend, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`${color} p-3 rounded-lg`}>
        {icon}
      </div>
      <div className="ml-5">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <div className="mt-1 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className={`ml-2 flex items-baseline text-sm ${
            trend === 'up' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {change}%
          </p>
        </div>
      </div>
    </div>
    <div className="mt-4">
      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
        Lihat Detail
      </button>
    </div>
  </div>
)

export default Dashboard 
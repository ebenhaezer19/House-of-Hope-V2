import { useState } from 'react'
import { 
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const AcademicManagement = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedGrade, setSelectedGrade] = useState('all')

  // Data dummy untuk statistik akademik
  const stats = {
    total_students: 100,
    average_score: 85.5,
    achievements: 25,
    active_programs: 8
  }

  // Data dummy untuk prestasi akademik
  const achievements = [
    {
      id: 1,
      student_name: 'John Doe',
      title: 'Juara 1 Olimpiade Matematika',
      level: 'Provinsi',
      date: '2024-02-15',
      category: 'Akademik',
      image: 'https://placehold.co/100x100'
    },
    {
      id: 2,
      student_name: 'Jane Smith',
      title: 'Juara 2 Lomba Karya Tulis',
      level: 'Nasional',
      date: '2024-03-01',
      category: 'Akademik',
      image: 'https://placehold.co/100x100'
    }
  ]

  // Data dummy untuk program pembinaan
  const programs = [
    {
      id: 1,
      name: 'Bimbingan Belajar Matematika',
      mentor: 'Dr. Smith',
      schedule: 'Senin & Rabu, 16:00-17:30',
      participants: 15,
      status: 'active',
      progress: 75
    },
    {
      id: 2,
      name: 'English Club',
      mentor: 'Mrs. Johnson',
      schedule: 'Selasa & Kamis, 15:00-16:30',
      participants: 20,
      status: 'active',
      progress: 60
    }
  ]

  // Data dummy untuk nilai akademik
  const grades = [
    {
      id: 1,
      student_name: 'John Doe',
      grade: 'SMA',
      class: '11',
      semester: 'Ganjil 2023/2024',
      subjects: [
        { name: 'Matematika', score: 85 },
        { name: 'Bahasa Inggris', score: 90 },
        { name: 'Fisika', score: 88 }
      ],
      average_score: 87.6,
      rank: 5,
      attendance: 95
    }
  ]

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Akademik</h1>
        <div className="mt-4 sm:mt-0 space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Tambah Program
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-6 w-6 text-indigo-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Penghuni</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.total_students}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Rata-rata Nilai</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.average_score}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Prestasi</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.achievements}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Program Aktif</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.active_programs}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="sm:flex sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">Semua Jenjang</option>
            <option value="sd">SD</option>
            <option value="smp">SMP</option>
            <option value="sma">SMA</option>
            <option value="kuliah">Kuliah</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'grades', name: 'Nilai Akademik' },
              { id: 'programs', name: 'Program Pembinaan' },
              { id: 'achievements', name: 'Prestasi' }
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
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Grafik Nilai Rata-rata */}
              <div className="bg-white border rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tren Nilai Rata-rata
                </h3>
                <div className="h-64">
                  {/* Tambahkan grafik di sini */}
                </div>
              </div>

              {/* Distribusi Prestasi */}
              <div className="bg-white border rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Distribusi Prestasi
                </h3>
                <div className="h-64">
                  {/* Tambahkan grafik di sini */}
                </div>
              </div>
            </div>
          )}

          {/* Nilai Akademik */}
          {activeTab === 'grades' && (
            <div className="space-y-6">
              {grades.map((student) => (
                <div
                  key={student.id}
                  className="bg-white border rounded-lg shadow-sm p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {student.student_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Kelas {student.grade} - {student.class}
                      </p>
                      <p className="text-sm text-gray-500">
                        {student.semester}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Rata-rata</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {student.average_score}
                      </p>
                      <p className="text-sm text-gray-500">
                        Peringkat: {student.rank}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Nilai Per Mata Pelajaran
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {student.subjects.map((subject, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {subject.name}
                          </p>
                          <p className="text-2xl font-semibold text-indigo-600">
                            {subject.score}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Kehadiran
                    </h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {student.attendance}% Kehadiran
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Program Pembinaan */}
          {activeTab === 'programs' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-white border rounded-lg shadow-sm p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {program.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mentor: {program.mentor}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      program.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {program.status === 'active' ? 'Aktif' : 'Selesai'}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-600">{program.schedule}</p>
                    </div>
                    <div className="flex items-center mt-2">
                      <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-600">
                        {program.participants} Peserta
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-gray-700">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Detail Program
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Daftar Peserta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Prestasi */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white border rounded-lg shadow-sm overflow-hidden"
                >
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {achievement.student_name}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                        {achievement.level}
                      </span>
                      <span className="text-sm text-gray-500">
                        {achievement.date}
                      </span>
                    </div>
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

export default AcademicManagement 
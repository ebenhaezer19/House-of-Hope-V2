import { useState, useEffect } from 'react'
import { UserCircleIcon, KeyIcon, BriefcaseIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState(authUser || {})
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (authUser) {
      setUser(authUser)
      setFormData(prev => ({
        ...prev,
        name: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phone || ''
      }))
    }
  }, [authUser])

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserCircleIcon },
    { id: 'security', name: 'Keamanan', icon: KeyIcon },
    { id: 'activity', name: 'Aktivitas', icon: BriefcaseIcon },
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Implementasi update profile
      console.log('Updating profile:', formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    try {
      // Implementasi change password
      console.log('Changing password')
    } catch (error) {
      console.error('Error changing password:', error)
    }
  }

  // Function untuk mendapatkan avatar berdasarkan role
  const getAvatarByRole = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return '/images/admin-avatar.png' // Pastikan file ada di public/images/
      case 'STAFF':
        return '/images/staff-avatar.png'
      default:
        return '/images/default-avatar.png'
    }
  }

  const getAvatarIcon = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return (
          <ShieldCheckIcon 
            className="h-32 w-32 text-purple-600 bg-purple-100 rounded-full p-4" 
          />
        )
      case 'STAFF':
        return (
          <UserIcon 
            className="h-32 w-32 text-indigo-600 bg-indigo-100 rounded-full p-4" 
          />
        )
      default:
        return (
          <UserCircleIcon 
            className="h-32 w-32 text-gray-600 bg-gray-100 rounded-full p-4" 
          />
        )
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-8">
        {getAvatarIcon(user.role)}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
            ${user.role?.toUpperCase() === 'ADMIN' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-indigo-100 text-indigo-800'}
          `}>
            {user.role}
          </span>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                No. Telepon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Simpan
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Informasi Profil
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.role}
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Edit Profil
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Ganti Password
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password Lama
              </label>
              <input
                type="password"
                name="oldPassword"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password Baru
              </label>
              <input
                type="password"
                name="newPassword"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  const renderActivityTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Riwayat Aktivitas
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Login ke sistem
                  </p>
                  <p className="text-sm text-gray-500">
                    2 jam yang lalu
                  </p>
                </div>
              </div>
            </li>
            {/* Add more activity items here */}
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
      </div>

      <div className="bg-white shadow">
        <div className="sm:hidden">
          <select
            className="block w-full rounded-md border-gray-300"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                  `}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'activity' && renderActivityTab()}
      </div>
    </div>
  )
}

export default Profile 
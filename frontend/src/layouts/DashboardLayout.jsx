import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  HomeIcon, 
  UserGroupIcon, 
  ExclamationCircleIcon, 
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChartBarIcon,
  ArchiveBoxIcon,
  AcademicCapIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import Notification from '../components/Notification'

const DashboardLayout = () => {
  const [isAuthenticated] = useState(localStorage.getItem('token'))
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'))
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })

  useEffect(() => {
    // Simulasi loading
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000)
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Data Penghuni', href: '/dashboard/residents', icon: UserGroupIcon },
    { name: 'Manajemen Kamar', href: '/dashboard/rooms', icon: HomeIcon },
    { name: 'Pembayaran', href: '/dashboard/payments', icon: CurrencyDollarIcon },
    { name: 'Fasilitas', href: '/dashboard/facilities', icon: BuildingOfficeIcon },
    { name: 'Pelaporan Masalah', href: '/dashboard/problems', icon: ExclamationCircleIcon },
    { name: 'Jadwal & Tugas', href: '/dashboard/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Keamanan', href: '/dashboard/security', icon: ShieldCheckIcon },
    { name: 'Kebersihan', href: '/dashboard/maintenance', icon: SparklesIcon },
    { name: 'Laporan', href: '/dashboard/reports', icon: ChartBarIcon },
    { name: 'Inventaris', href: '/dashboard/inventory', icon: ArchiveBoxIcon },
    { name: 'Akademik', href: '/dashboard/academic', icon: AcademicCapIcon },
  ]

  const handleLogout = () => {
    showNotification('success', 'Berhasil logout')
    setTimeout(() => {
      localStorage.removeItem('token')
      window.location.reload()
    }, 1000)
  }

  const getAvatarIcon = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return <ShieldCheckIcon className="h-8 w-8 text-purple-600 bg-purple-100 rounded-full p-1" />
      case 'STAFF':
        return <UserIcon className="h-8 w-8 text-indigo-600 bg-indigo-100 rounded-full p-1" />
      default:
        return <UserCircleIcon className="h-8 w-8 text-gray-600 bg-gray-100 rounded-full p-1" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234338ca' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10">
        <Notification
          show={notification.show}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
        
        {/* Sidebar Desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex-1 flex flex-col min-h-0 bg-white/90 backdrop-blur-sm border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <OptimizedImage 
                  src="/ADMINCARE.svg"
                  alt="AdminCare"
                  className="h-12 w-auto"
                />
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-md
                        transition-all duration-200 ease-in-out
                        ${isActive
                          ? 'bg-indigo-50 text-indigo-600 transform scale-105'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <item.icon
                        className={`
                          mr-3 flex-shrink-0 h-5 w-5
                          transition-colors duration-200 ease-in-out
                          ${isActive
                            ? 'text-indigo-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                          }
                        `}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Mobile */}
        <div className="lg:hidden">
          {isSidebarOpen && (
            <div className="fixed inset-0 flex z-40">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
              <div className="relative flex-1 flex flex-col max-w-xs w-64 bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
                <SidebarContent navigation={navigation} pathname={location.pathname} />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Navbar */}
          <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <button
                    type="button"
                    className="lg:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-center">
                  {/* Profile dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center max-w-xs rounded-full focus:outline-none"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                      {getAvatarIcon(user.role)}
                      <span className="ml-3 text-sm font-medium text-gray-700">{user.name}</span>
                    </button>

                    {/* Profile dropdown panel */}
                    {isProfileOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <div className="px-4 py-2">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <span className={`
                              inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1
                              ${user.role?.toUpperCase() === 'ADMIN' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-indigo-100 text-indigo-800'}
                            `}>
                              {user.role}
                            </span>
                          </div>
                          <hr />
                          <Link
                            to="/dashboard/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Pengaturan Profil
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Keluar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

const SidebarContent = ({ navigation, pathname }) => {
  return (
    <div className="flex flex-col flex-grow pt-5">
      <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
        <OptimizedImage 
          src="/ADMINCARE.svg"
          alt="AdminCare"
          className="h-12 w-auto"
        />
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

const OptimizedImage = ({ src, alt, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}

export default DashboardLayout 
import { useAuth } from '../contexts/AuthContext'
import { ShieldCheckIcon, UserIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export const Dashboard = () => {
  const { user } = useAuth()

  const getAvatarIcon = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return (
          <ShieldCheckIcon 
            className="h-16 w-16 text-purple-600 bg-purple-100 rounded-full p-3" 
          />
        )
      case 'STAFF':
        return (
          <UserIcon 
            className="h-16 w-16 text-indigo-600 bg-indigo-100 rounded-full p-3" 
          />
        )
      default:
        return (
          <UserCircleIcon 
            className="h-16 w-16 text-gray-600 bg-gray-100 rounded-full p-3" 
          />
        )
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          {getAvatarIcon(user?.role)}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.name}
            </h1>
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
              ${user?.role?.toUpperCase() === 'ADMIN' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-indigo-100 text-indigo-800'}
            `}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Konten dashboard lainnya */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards atau komponen lainnya */}
      </div>
    </div>
  )
}

export default Dashboard 
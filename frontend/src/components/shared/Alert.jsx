import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const Alert = ({
  type = 'info', // success, warning, error, info
  title,
  message,
  className = ''
}) => {
  const types = {
    success: {
      icon: CheckCircleIcon,
      color: 'text-green-400',
      bg: 'bg-green-50',
      border: 'border-green-400'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-400',
      bg: 'bg-yellow-50',
      border: 'border-yellow-400'
    },
    error: {
      icon: XCircleIcon,
      color: 'text-red-400',
      bg: 'bg-red-50',
      border: 'border-red-400'
    },
    info: {
      icon: InformationCircleIcon,
      color: 'text-blue-400',
      bg: 'bg-blue-50',
      border: 'border-blue-400'
    }
  }

  const Icon = types[type].icon

  return (
    <div className={`
      rounded-md p-4 border-l-4
      ${types[type].bg}
      ${types[type].border}
      ${className}
    `}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${types[type].color}`} />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${types[type].color}`}>
              {title}
            </h3>
          )}
          <div className="text-sm text-gray-700">
            {message}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alert 
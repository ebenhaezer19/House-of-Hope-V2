import { useRef } from 'react'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

const FileUpload = ({
  label,
  accept,
  onChange,
  error,
  className = ''
}) => {
  const fileInputRef = useRef(null)

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div 
        className={`
          mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed
          rounded-md cursor-pointer hover:border-gray-400 transition-colors
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-1 text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
              <span>Upload file</span>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept={accept}
                onChange={onChange}
              />
            </label>
            <p className="pl-1">atau drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, PDF up to 10MB
          </p>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FileUpload 
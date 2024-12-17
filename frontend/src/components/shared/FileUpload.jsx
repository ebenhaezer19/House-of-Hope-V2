import { useRef } from 'react'

const FileUpload = ({ 
  label, 
  name, 
  accept, 
  multiple = false, 
  required = false,
  onChange,
  help,
  error
}) => {
  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    
    // Trigger onChange dengan files yang di-drop
    const event = {
      target: {
        name,
        files: droppedFiles
      }
    }
    onChange(event)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 transition-colors cursor-pointer"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          required={required}
          onChange={onChange}
          className="hidden"
        />
        
        <div className="text-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              Upload file
            </span>
            {" atau drag and drop"}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {accept?.split(',').join(', ')} up to 10MB
          </p>
        </div>
      </div>

      {help && (
        <p className="text-sm text-gray-500">{help}</p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FileUpload 
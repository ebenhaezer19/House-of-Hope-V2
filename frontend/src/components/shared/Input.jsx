const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  className = ''
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-indigo-500 focus:ring-indigo-500
          ${className}
        `}
      />
    </div>
  )
}

export default Input 
const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  disabled = false,
  placeholder
}) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`select select-bordered w-full ${error ? 'select-error' : ''}`}
        disabled={disabled}
      >
        <option value="">{placeholder || `Pilih ${label}`}</option>
        {options.map(option => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.isDisabled}
            className={option.isDisabled ? 'text-gray-400' : ''}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default Select; 
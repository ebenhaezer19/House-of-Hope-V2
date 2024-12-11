const Card = ({
  title,
  children,
  className = '',
  actions,
  ...props
}) => {
  return (
    <div 
      className={`
        bg-white/90 backdrop-blur-sm
        shadow-sm rounded-lg overflow-hidden
        border border-gray-200/50
        ${className}
      `}
      {...props}
    >
      {title && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200/50">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
      {actions && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50/80 border-t border-gray-200/50">
          {actions}
        </div>
      )}
    </div>
  )
}

export default Card 
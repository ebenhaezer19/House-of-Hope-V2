const Card = ({ title, children }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  )
}

export default Card 
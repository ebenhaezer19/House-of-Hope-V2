import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { Alert } from '../../components/shared'

const Residents = () => {
  const location = useLocation()
  const [successMessage, setSuccessMessage] = useState(location.state?.message)
  const [residents, setResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (successMessage) {
      // Clear message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    fetchResidents()
  }, [])

  const fetchResidents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/residents')
      console.log('Response data:', response.data)
      setResidents(response.data)
    } catch (error) {
      console.error('Error fetching residents:', error)
      setError('Gagal mengambil data penghuni')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        setLoading(true)
        await api.delete(`/residents/${id}`)
        setError(null)
        // Refresh data setelah berhasil menghapus
        fetchResidents()
      } catch (error) {
        console.error('Error deleting resident:', error)
        setError(
          error.response?.data?.message || 
          'Gagal menghapus data penghuni. Silakan coba lagi.'
        )
      } finally {
        setLoading(false)
      }
    }
  }

  const getImageUrl = (path) => {
    if (!path) return '/assets/default-avatar.png'
    
    try {
      // Gunakan baseUrl dari env
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'
      const fullUrl = `${baseUrl}${path}`
      
      // Validasi path
      if (!path.startsWith('/uploads/')) {
        console.warn('Invalid image path:', path)
        return '/assets/default-avatar.png'
      }
      
      console.log('Image URL:', {
        path,
        baseUrl,
        fullUrl
      })
      
      return fullUrl
    } catch (error) {
      console.error('Error generating image URL:', error)
      return '/assets/default-avatar.png'
    }
  }

  if (loading) {
    return <div className="text-center py-10">Memuat data...</div>
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Daftar Penghuni</h1>
        <Link
          to="/dashboard/residents/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Tambah Penghuni
        </Link>
      </div>

      {successMessage && (
        <Alert type="success" message={successMessage} />
      )}

      {error && (
        <Alert type="error" message={error} />
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Kelamin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendidikan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kamar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bantuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {residents.map((resident) => (
                <tr key={resident.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {resident.documents?.find(d => d.type === 'photo') ? (
                        <div className="relative h-10 w-10">
                          {console.log('Resident documents:', {
                            name: resident.name,
                            documents: resident.documents,
                            photoDoc: resident.documents.find(d => d.type === 'photo')
                          })}
                          <img
                            src={getImageUrl(resident.documents.find(d => d.type === 'photo')?.path)}
                            alt={resident.name}
                            className="h-full w-full rounded-full object-cover bg-gray-100"
                            onError={(e) => {
                              console.error('Image load error:', {
                                name: resident.name,
                                path: e.target.src,
                                error: e.error
                              })
                              e.target.onerror = null
                              e.target.src = '/assets/default-avatar.png'
                            }}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm font-medium">
                            {resident.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {resident.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resident.phone || '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.nik}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{resident.education}</div>
                    <div className="text-sm text-gray-500">{resident.schoolName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.room?.number || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      resident.assistance === 'YAYASAN' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {resident.assistance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/residents/${resident.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(resident.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Residents
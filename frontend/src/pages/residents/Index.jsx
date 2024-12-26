import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { residentService } from '../../services/resident.service'
import { Card } from '../../components/shared'
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

const ResidentIndex = () => {
  const [residents, setResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    gender: '',
    education: '',
    assistance: ''
  })

  useEffect(() => {
    fetchResidents()
  }, [])

  const fetchResidents = async () => {
    try {
      setLoading(true)
      const response = await residentService.getAll()
      setResidents(response.data)
      setError(null)
    } catch (error) {
      console.error('Error fetching residents:', error)
      setError('Gagal memuat data penghuni')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      // Konfirmasi penghapusan
      const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus data penghuni ini?');
      
      if (!isConfirmed) {
        return;
      }

      await residentService.delete(id);
      
      // Refresh data setelah berhasil menghapus
      fetchResidents();
      
      // Tampilkan notifikasi sukses
      toast.success('Penghuni berhasil dihapus');

    } catch (error) {
      console.error('Error deleting resident:', error);
      
      // Tampilkan pesan error yang sesuai
      if (error.response?.status === 404) {
        toast.error('Penghuni tidak ditemukan');
      } else {
        toast.error('Gagal menghapus penghuni');
      }
    }
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = 
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilters = (
      (!filters.status || resident.status === filters.status) &&
      (!filters.gender || resident.gender === filters.gender) &&
      (!filters.education || resident.education === filters.education) &&
      (!filters.assistance || resident.assistance === filters.assistance)
    )

    return matchesSearch && matchesFilters
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800'
      case 'NEW':
        return 'bg-green-100 text-green-800'
      case 'ALUMNI':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktif'
      case 'NEW':
        return 'Baru'
      case 'ALUMNI':
        return 'Alumni'
      default:
        return status
    }
  }

  const getEducationText = (education) => {
    const educationMap = {
      'TK': 'TK',
      'SD': 'SD',
      'SMP': 'SMP',
      'SMA': 'SMA',
      'KULIAH': 'Kuliah',
      'MAGANG': 'Magang'
    }
    return educationMap[education] || education
  }

  const getPhotoUrl = (resident) => {
    const photoDoc = resident.documents?.find(doc => doc.type === 'photo');
    if (photoDoc) {
      return `${import.meta.env.VITE_API_URL}${photoDoc.path}`;
    }
    return null;
  };

  const getLatestProfilePhoto = (documents) => {
    if (!documents || documents.length === 0) return null;
    
    const photos = documents
      .filter(doc => doc.type === 'photo')
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
    
    return photos.length > 0 ? photos[0] : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="text-red-700">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Penghuni</h1>
        <Link
          to="/dashboard/residents/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Tambah Penghuni
        </Link>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, NIK, atau sekolah..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 md:col-span-3">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="NEW">Baru</option>
              <option value="ALUMNI">Alumni</option>
            </select>

            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Gender</option>
              <option value="MALE">Laki-laki</option>
              <option value="FEMALE">Perempuan</option>
            </select>

            <select
              value={filters.education}
              onChange={(e) => setFilters({ ...filters, education: e.target.value })}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Pendidikan</option>
              <option value="TK">TK</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="KULIAH">Kuliah</option>
              <option value="MAGANG">Magang</option>
            </select>

            <select
              value={filters.assistance}
              onChange={(e) => setFilters({ ...filters, assistance: e.target.value })}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Bantuan</option>
              <option value="YAYASAN">Yayasan</option>
              <option value="DIAKONIA">Diakonia</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Residents Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Pribadi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendidikan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kamar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokumen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {residents.map((resident) => (
                <tr key={resident.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {resident.documents && getLatestProfilePhoto(resident.documents) ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={`${import.meta.env.VITE_API_URL}${getLatestProfilePhoto(resident.documents).path}`}
                            alt={resident.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-avatar.png';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">{resident.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                        <div className="text-sm text-gray-500">{resident.nik}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{resident.schoolName}</div>
                    <div className="text-sm text-gray-500">
                      {resident.education} {resident.grade && `- ${resident.grade}`}
                      {resident.major && ` (${resident.major})`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Kamar {resident.room?.number}
                    </div>
                    <div className="text-sm text-gray-500">
                      Lantai {resident.room?.floor}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${resident.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' : 
                        resident.status === 'ALUMNI' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}
                    >
                      {resident.status === 'ACTIVE' ? 'Aktif' : 
                       resident.status === 'ALUMNI' ? 'Alumni' : 'Baru'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {resident.documents?.map((doc) => (
                        <a
                          key={doc.id}
                          href={`${import.meta.env.VITE_API_URL}${doc.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {doc.type === 'photo' ? (
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                          {doc.type === 'photo' ? 'Foto' : 'Dokumen'}
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/residents/${resident.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(resident.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ResidentIndex

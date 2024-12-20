import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PencilIcon, TrashIcon, DocumentIcon, EyeIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { Alert } from '../../components/shared'
import defaultAvatar from '../../assets/default-avatar.png';

const ResidentIndex = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState(location.state?.message)
  const [residents, setResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloadingDoc, setDownloadingDoc] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const filterStatus = location.state?.filterStatus;
  const [filters, setFilters] = useState({
    name: '',
    gender: '',
    room: '',
    assistance: '',
    status: ''
  });

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
    const fetchResidents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/residents');
        let filteredData = response.data;

        // Terapkan filter jika ada
        if (filterStatus) {
          filteredData = filteredData.filter(resident => 
            resident.status === filterStatus
          );
        }

        setResidents(filteredData);
      } catch (error) {
        setError('Gagal memuat data penghuni');
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, [filterStatus]);

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      // Panggil API untuk menghapus data
      await api.delete(`/api/residents/${id}`);
      
      // Refresh data setelah berhasil menghapus
      const response = await api.get('/api/residents');
      let filteredData = response.data;

      // Terapkan filter jika ada
      if (filterStatus) {
        filteredData = filteredData.filter(resident => 
          resident.status === filterStatus
        );
      }

      setResidents(filteredData);
      setSuccessMessage('Data penghuni berhasil dihapus');

    } catch (error) {
      console.error('Error deleting resident:', error);
      setError(error.response?.data?.message || 'Gagal menghapus data penghuni');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getPhotoUrl = (resident) => {
    try {
      // Cek jika resident punya foto
      const photoDoc = resident.documents?.find(doc => doc.type === 'photo');
      
      if (photoDoc?.path) {
        // Jika ada foto, gunakan URL backend
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
        return `${baseUrl}${photoDoc.path}`;
      }
      
      // Jika tidak ada foto, gunakan default avatar
      return defaultAvatar;
    } catch (error) {
      console.error('Error getting photo URL:', error);
      return defaultAvatar;
    }
  };

  const handleImageError = (e, resident) => {
    console.log('Image load error:', {
      name: resident.name,
      error: e.error,
      src: e.target.src
    });
    
    // Set default avatar jika gambar gagal dimuat
    e.target.src = defaultAvatar;
    e.target.onerror = null; // Prevent infinite loop
  };

  const handlePreviewDocument = (path) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'
      const fullUrl = `${baseUrl}${path}`
      
      console.log('Opening document:', {
        path,
        fullUrl
      })

      // Buka PDF di tab baru
      window.location.href = fullUrl

    } catch (error) {
      console.error('Error handling document:', error)
      alert('Terjadi kesalahan saat membuka dokumen')
    }
  }

  // Tambahkan fungsi untuk mendapatkan label status
  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Penghuni Aktif';
      case 'NEW': return 'Penghuni Baru';
      case 'ALUMNI': return 'Alumni';
      default: return 'Semua Penghuni';
    }
  };

  // Tambahkan fungsi untuk clear filter
  const clearFilter = () => {
    navigate('/dashboard/residents', { replace: true });
  };

  // Tambahkan fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Tambahkan fungsi untuk handle perubahan filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Tambahkan fungsi untuk filter data
  const filteredResidents = residents.filter(resident => {
    return (
      resident.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (filters.gender === '' || resident.gender === filters.gender) &&
      (filters.room === '' || resident.room?.number?.toString() === filters.room) &&
      (filters.assistance === '' || resident.assistance === filters.assistance) &&
      (filters.status === '' || resident.status === filters.status)
    );
  });

  if (loading) {
    return <div className="text-center py-10">Memuat data...</div>
  }

  return (
    <div className="space-y-4">
      {/* Header dengan info filter */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            {filterStatus ? getStatusLabel(filterStatus) : 'Daftar Penghuni'}
          </h1>
          {filterStatus && (
            <div className="mt-1 flex items-center">
              <span className="text-sm text-gray-500">
                Menampilkan {getStatusLabel(filterStatus)} saja
              </span>
              <button
                onClick={clearFilter}
                className="ml-2 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Lihat semua
              </button>
            </div>
          )}
        </div>
        <Link
          to="/dashboard/residents/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Tambah Penghuni
        </Link>
      </div>

      {/* Alert messages */}
      {successMessage && (
        <Alert type="success" message={successMessage} />
      )}

      {error && (
        <Alert type="error" message={error} />
      )}

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Filter Penghuni</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Cari nama..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Kelamin
            </label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Semua</option>
              <option value="MALE">Laki-laki</option>
              <option value="FEMALE">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Kamar
            </label>
            <input
              type="text"
              name="room"
              value={filters.room}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Nomor kamar..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bantuan
            </label>
            <select
              name="assistance"
              value={filters.assistance}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Semua</option>
              <option value="YAYASAN">Yayasan</option>
              <option value="MANDIRI">Mandiri</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Semua</option>
              <option value="NEW">Penghuni Baru</option>
              <option value="ACTIVE">Penghuni Aktif</option>
              <option value="ALUMNI">Alumni</option>
            </select>
          </div>
        </div>
      </div>

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
                  Dokumen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Daftar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResidents.map((resident) => (
                <tr key={resident.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10">
                        <img
                          src={getPhotoUrl(resident)}
                          alt={`Foto ${resident.name}`}
                          className="h-full w-full rounded-full object-cover bg-gray-100"
                          onError={(e) => handleImageError(e, resident)}
                          loading="lazy"
                        />
                      </div>
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
                      {resident.documents
                        .filter(doc => doc.type === 'document')
                        .map((doc, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setDownloadingDoc(doc.path)
                              handlePreviewDocument(doc.path)
                              setTimeout(() => setDownloadingDoc(null), 1000) // Reset setelah 1 detik
                            }}
                            className="group relative"
                            title={doc.name}
                            disabled={downloadingDoc === doc.path}
                          >
                            <DocumentIcon 
                              className={`h-6 w-6 ${
                                downloadingDoc === doc.path 
                                  ? 'text-gray-400 animate-pulse'
                                  : 'text-gray-500 hover:text-indigo-600'
                              }`} 
                            />
                            <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                              {downloadingDoc === doc.path ? 'Mengunduh...' : doc.name}
                            </span>
                          </button>
                        ))}
                      {resident.documents.filter(doc => doc.type === 'document').length === 0 && (
                        <span className="text-gray-400 italic">Tidak ada dokumen</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(resident.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(resident.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {resident.status === 'ALUMNI' && resident.exitDate && (
                      <div className="mt-1 text-xs">
                        <span className="text-yellow-600 font-medium">Tanggal Keluar:</span>
                        <br />
                        <span className="text-gray-600">
                          {new Date(resident.exitDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      resident.status === 'ACTIVE' 
                        ? 'bg-indigo-100 text-indigo-800'
                        : resident.status === 'NEW'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusLabel(resident.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/residents/${resident.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/dashboard/payments?residentId=${resident.id}`}
                        className="text-green-600 hover:text-green-900"
                        title="Kelola Pembayaran"
                      >
                        <CreditCardIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(resident.id)}
                        className={`text-red-600 hover:text-red-900 ${
                          deleteLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={deleteLoading}
                        title="Hapus"
                      >
                        <TrashIcon className={`h-5 w-5 ${
                          deleteLoading ? 'animate-pulse' : ''
                        }`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tampilkan pesan jika tidak ada data */}
      {filteredResidents.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {residents.length === 0 
              ? 'Tidak ada data penghuni'
              : 'Tidak ada penghuni yang sesuai dengan filter'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ResidentIndex
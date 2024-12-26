import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { residentService } from '../../services/resident.service'
import { Card } from '../../components/shared'

const ResidentForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rooms, setRooms] = useState([])
  
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: 'MALE',
    address: '',
    phone: '',
    education: 'SMA',
    schoolName: '',
    grade: '',
    major: '',
    assistance: 'YAYASAN',
    details: '',
    roomId: '',
    status: 'NEW',
    documents: []
  })

  useEffect(() => {
    fetchRooms()
    if (id) {
      fetchResident()
    }
  }, [id])

  const fetchRooms = async () => {
    try {
      const response = await residentService.getRooms()
      setRooms(response.data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setError('Gagal memuat data kamar: ' + (error.response?.data?.message || error.message))
    }
  }

  const fetchResident = async () => {
    try {
      setLoading(true)
      const response = await residentService.getById(id)
      const resident = response.data
      if (resident.birthDate) {
        resident.birthDate = new Date(resident.birthDate).toISOString().split('T')[0]
      }
      setFormData(resident)
    } catch (error) {
      console.error('Error fetching resident:', error)
      setError('Gagal memuat data penghuni: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format data yang akan dikirim
      const submitData = {
        name: formData.name.trim(),
        nik: formData.nik.trim(),
        birthPlace: formData.birthPlace.trim(),
        birthDate: formData.birthDate || null,
        gender: formData.gender || 'MALE',
        address: (formData.address || '').trim(),
        phone: formData.phone ? formData.phone.trim() : null,
        education: formData.education || 'SMA',
        schoolName: (formData.schoolName || '').trim(),
        grade: formData.grade ? formData.grade.trim() : null,
        major: formData.major ? formData.major.trim() : null,
        assistance: formData.assistance || 'YAYASAN',
        details: formData.details ? formData.details.trim() : null,
        roomId: formData.roomId ? Number(formData.roomId) : null,
        status: formData.status || 'NEW'
      };

      // Log data sebelum dikirim
      console.log('=== FORM SUBMIT DEBUG ===');
      console.log('Form data:', formData);
      console.log('Submit data:', submitData);

      if (id) {
        await residentService.update(id, submitData);
      } else {
        await residentService.create(submitData);
      }

      navigate('/dashboard/residents');
    } catch (error) {
      console.error('Error saving resident:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus penghuni ini? Semua dokumen terkait juga akan dihapus.')) {
      try {
        setLoading(true);
        setError(null);
        
        console.log('=== DELETE DEBUG ===');
        console.log('Deleting resident:', id);
        
        await residentService.delete(id);
        
        alert('Penghuni berhasil dihapus');
        navigate('/dashboard/residents');
      } catch (error) {
        console.error('Error deleting resident:', error);
        const errorMessage = error.response?.data?.message || error.message;
        setError(`Gagal menghapus penghuni: ${errorMessage}`);
        alert('Gagal menghapus penghuni. ' + errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validasi file
    for (const file of files) {
      // Validasi ukuran (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} terlalu besar. Maksimal 5MB`);
        return;
      }
      
      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} tidak didukung. Format yang didukung: JPG, PNG, PDF`);
        return;
      }

      // Buat FormData baru untuk setiap file
      const formData = new FormData();
      
      // Tentukan tipe dokumen berdasarkan mime type
      const isImage = file.type.startsWith('image/');
      
      // Gunakan nama field yang sesuai berdasarkan tipe file
      if (isImage) {
        formData.append('photo', file);  // Untuk foto
      } else {
        formData.append('file', file);   // Untuk dokumen
      }
      
      console.log('=== FILE DEBUG ===');
      console.log('File name:', file.name);
      console.log('File type:', file.type);
      console.log('Is image:', isImage);

      try {
        setLoading(true);
        console.log('=== UPLOAD DEBUG ===');
        console.log('Resident ID:', id);
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }
        
        // Upload file satu per satu
        const endpoint = isImage ? 'photo' : 'document';
        await residentService.uploadDocuments(id, formData, endpoint);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Gagal mengunggah file: ' + (error.response?.data?.message || error.message));
        return;
      }
    }

    try {
      // Tunggu sebentar sebelum fetch ulang data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch ulang data penghuni untuk mendapatkan dokumen terbaru
      const updatedResident = await residentService.getById(id);
      
      // Update state dengan data terbaru
      if (updatedResident.data) {
        console.log('=== UPDATED RESIDENT DATA ===');
        console.log('Updated documents:', updatedResident.data.documents);
        setFormData(prev => ({
          ...prev,
          documents: updatedResident.data.documents || []
        }));
      }

      // Reset input file
      e.target.value = '';
      
      alert('Dokumen berhasil diunggah');
    } catch (error) {
      console.error('Error updating resident data:', error);
      setError('Gagal memperbarui data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Penghuni' : 'Tambah Penghuni'}
        </h1>
      </div>

      <Card className="overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-700">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Pribadi */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Data Pribadi</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">NIK</label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="MALE">Laki-laki</option>
                  <option value="FEMALE">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">No. Telepon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Data Pendidikan dan Bantuan */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Data Pendidikan & Bantuan</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Pendidikan</label>
                <select
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="TK">TK</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="KULIAH">Kuliah</option>
                  <option value="MAGANG">Magang</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Sekolah/Institusi</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kelas/Tingkat</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Jurusan</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Bantuan</label>
                <select
                  value={formData.assistance}
                  onChange={(e) => setFormData({ ...formData, assistance: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="YAYASAN">Yayasan</option>
                  <option value="DIAKONIA">Diakonia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kamar</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Pilih Kamar</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.number} - Lantai {room.floor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="NEW">Baru</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="ALUMNI">Alumni</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Keterangan Tambahan</label>
                <textarea
                  value={formData.details || ''}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Dokumen */}
          {id && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Dokumen</h2>
              
              {/* Preview foto */}
              <div className="grid grid-cols-2 gap-4">
                {formData.documents
                  ?.filter(doc => doc.type === 'photo')
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${photo.path}`}
                        alt={`Foto ${formData.name}`}
                        className="h-40 w-full object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-avatar.png';
                        }}
                      />
                    </div>
                  ))}
              </div>

              {/* Upload file */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Dokumen</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,application/pdf"
                  multiple
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Format yang didukung: JPG, PNG, PDF. Maksimal 5MB per file.
                </p>
              </div>

              {/* Daftar dokumen */}
              {formData.documents?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Dokumen Terlampir</h3>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {formData.documents.map((doc) => (
                      <li key={doc.id} className="py-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">{doc.name}</span>
                          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {doc.type === 'photo' ? 'Foto' : 'Dokumen'}
                          </span>
                        </div>
                        <a
                          href={`${import.meta.env.VITE_API_URL}${doc.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Lihat
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
              <button
              type="button"
              onClick={() => navigate('/dashboard/residents')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Batal
              </button>
              <button
              type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
          </div>
        </form>
        </Card>
      </div>
    )
  }

  export default ResidentForm 
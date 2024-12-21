import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import {
  Alert,
  Button,
  Card,
  Input,
  Select,
  Textarea,
  FileUpload
} from '../../components/shared'
import { DocumentIcon } from '@heroicons/react/24/outline'
import ImageModal from '../../components/shared/ImageModal'

const EditResident = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  
  // Master data untuk opsi-opsi
  const [masterData] = useState({
    statuses: [
      { value: 'NEW', label: 'Penghuni Baru' },
      { value: 'ACTIVE', label: 'Penghuni Aktif' },
      { value: 'ALUMNI', label: 'Alumni' }
    ],
    genders: [
      { value: 'MALE', label: 'Laki-laki' },
      { value: 'FEMALE', label: 'Perempuan' }
    ],
    educations: [
      { value: 'TK', label: 'TK' },
      { value: 'SD', label: 'SD' },
      { value: 'SMP', label: 'SMP' },
      { value: 'SMA', label: 'SMA' },
      { value: 'KULIAH', label: 'Kuliah' },
      { value: 'MAGANG', label: 'Magang' }
    ],
    assistanceTypes: [
      { value: 'YAYASAN', label: 'Yayasan' },
      { value: 'DIAKONIA', label: 'Diakonia' }
    ]
  })

  // State untuk files
  const [files, setFiles] = useState({
    photo: null,
    documents: [],
    existingPhoto: null,
    existingDocuments: []
  })

  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    address: '',
    phone: '',
    education: '',
    schoolName: '',
    grade: '',
    major: '',
    assistance: '',
    details: '',
    roomId: '',
    status: '',
    exitDate: '',
    alumniNotes: ''
  })

  // Tambahkan state untuk modal
  const [showImageModal, setShowImageModal] = useState(false)

  // Fetch rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true)
        const response = await api.get('/api/rooms')
        
        const availableRooms = response.data.map(room => ({
          value: room.id.toString(),
          label: `${room.number} - Lantai ${room.floor} (${room.capacity} tempat)`,
          isDisabled: false // Biarkan semua kamar bisa dipilih untuk edit
        }))

        setRooms(availableRooms)
      } catch (error) {
        console.error('Error fetching rooms:', error)
        setError('Gagal memuat data kamar')
      } finally {
        setLoadingRooms(false)
      }
    }

    fetchRooms()
  }, [])

  // Fetch resident data
  useEffect(() => {
    const fetchResident = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/api/residents/${id}`)
        const resident = response.data

        setFormData({
          name: resident.name,
          nik: resident.nik,
          birthPlace: resident.birthPlace,
          birthDate: resident.birthDate,
          gender: resident.gender,
          address: resident.address,
          phone: resident.phone || '',
          education: resident.education,
          schoolName: resident.schoolName,
          grade: resident.grade || '',
          major: resident.major || '',
          assistance: resident.assistance,
          details: resident.details || '',
          roomId: resident.roomId.toString(),
          status: resident.status,
          exitDate: resident.exitDate ? new Date(resident.exitDate).toISOString().split('T')[0] : '',
          alumniNotes: resident.alumniNotes || ''
        })

        // Set existing files
        const existingPhoto = resident.documents?.find(doc => doc.type === 'photo')
        const existingDocs = resident.documents?.filter(doc => doc.type === 'document')

        setFiles(prev => ({
          ...prev,
          existingPhoto,
          existingDocuments: existingDocs || []
        }))

      } catch (error) {
        console.error('Error fetching resident:', error)
        setError('Gagal memuat data penghuni')
      } finally {
        setLoading(false)
      }
    }

    fetchResident()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'status' && value !== 'ALUMNI' ? {
        exitDate: '',
        alumniNotes: ''
      } : {})
    }))
  }

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    
    console.log('File upload:', {
      name,
      files: uploadedFiles,
      count: uploadedFiles?.length
    });

    if (name === 'photo') {
      setFiles(prev => ({
        ...prev,
        photo: uploadedFiles[0]
      }));
    } else if (name === 'documents') {
      setFiles(prev => ({
        ...prev,
        documents: Array.from(uploadedFiles)
      }));
    }
  }

  // Tambahkan handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validasi data wajib
      if (!formData.name || !formData.nik || !formData.roomId) {
        throw new Error('Mohon lengkapi data wajib');
      }

      // Siapkan FormData
      const formDataToSend = new FormData();

      // Tambahkan data penghuni
      const dataToSend = {
        ...formData,
        roomId: parseInt(formData.roomId)
      };
      formDataToSend.append('data', JSON.stringify(dataToSend));

      // Tambahkan foto jika ada
      if (files.photo) {
        console.log('Adding photo:', {
          name: files.photo.name,
          type: files.photo.type,
          size: files.photo.size
        });
        formDataToSend.append('photo', files.photo);
      }

      // Tambahkan dokumen jika ada
      if (files.documents.length > 0) {
        files.documents.forEach(doc => {
          console.log('Adding document:', {
            name: doc.name,
            type: doc.type,
            size: doc.size
          });
          formDataToSend.append('documents', doc);
        });
      }

      // Log FormData untuk debug
      console.log('FormData entries:');
      for (const pair of formDataToSend.entries()) {
        if (pair[0] === 'data') {
          console.log('- data:', JSON.parse(pair[1]));
        } else if (pair[1] instanceof File) {
          console.log(`- ${pair[0]}:`, {
            name: pair[1].name,
            type: pair[1].type,
            size: pair[1].size
          });
        }
      }

      // Kirim request dengan progress
      try {
        const response = await api.uploadFiles(`/api/residents/${id}`, formDataToSend);
        console.log('Update response:', response.data);

        // Redirect dengan pesan sukses
        navigate('/dashboard/residents', {
          state: { message: 'Data penghuni berhasil diperbarui' }
        });
      } catch (error) {
        console.error('Upload error:', error);
        throw error; // Re-throw untuk ditangkap oleh catch block di atas
      }

    } catch (error) {
      console.error('Error updating resident:', error);
      let errorMessage = 'Gagal memperbarui data penghuni. ';

      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message.includes('Network Error')) {
        errorMessage += 'Koneksi terputus. Silakan coba lagi.';
      } else {
        errorMessage += error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Penghuni</h2>

      {error && (
        <Alert type="error" message={error} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Pribadi */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Data Pribadi</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              label="NIK"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              required
              maxLength={16}
            />

            <Input
              label="Tempat Lahir"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              required
            />

            <Input
              type="date"
              label="Tanggal Lahir"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />

            <Select
              label="Jenis Kelamin"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              {masterData.genders.map(gender => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </Select>

            <Input
              label="No. Telepon"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Alamat Lengkap"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </Card>

        {/* Data Pendidikan */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Data Pendidikan</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Select
              label="Jenjang Pendidikan"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jenjang</option>
              {masterData.educations.map(edu => (
                <option key={edu.value} value={edu.value}>
                  {edu.label}
                </option>
              ))}
            </Select>

            <Input
              label="Nama Sekolah"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />

            <Input
              label="Kelas/Tingkat"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            />

            <Input
              label="Jurusan"
              name="major"
              value={formData.major}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Data Bantuan */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Data Bantuan</h3>
          <div className="space-y-4">
            <Select
              label="Jenis Bantuan"
              name="assistance"
              value={formData.assistance}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jenis Bantuan</option>
              {masterData.assistanceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>

            <Textarea
              label="Keterangan Bantuan"
              name="details"
              value={formData.details}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Penempatan Kamar */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Penempatan Kamar</h3>
          <Select
            label="Pilih Kamar"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            disabled={loadingRooms}
          >
            <option value="">
              {loadingRooms ? 'Memuat data kamar...' : 'Pilih Kamar'}
            </option>
            {rooms.map(room => (
              <option 
                key={room.value} 
                value={room.value}
                disabled={room.isDisabled}
              >
                {room.label}
              </option>
            ))}
          </Select>
        </Card>

        {/* Status Penghuni */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Status Penghuni</h3>
          <div className="space-y-4">
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Status</option>
              {masterData.statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>

            {formData.status === 'ALUMNI' && (
              <>
                <Input
                  type="date"
                  label="Tanggal Keluar"
                  name="exitDate"
                  value={formData.exitDate}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  label="Keterangan Alumni"
                  name="alumniNotes"
                  value={formData.alumniNotes}
                  onChange={handleChange}
                  required
                />
              </>
            )}
          </div>
        </Card>

        {/* Dokumen */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Dokumen</h3>
          
          {/* Existing photo with click handler */}
          {files.existingPhoto && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Foto saat ini:</p>
              <div 
                className="relative w-32 h-32 cursor-pointer group"
                onClick={() => setShowImageModal(true)}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${files.existingPhoto.path}`}
                  alt="Foto penghuni"
                  className="w-full h-full object-cover rounded-lg transition-opacity group-hover:opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    Klik untuk perbesar
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Photo upload */}
          <FileUpload
            label="Upload Foto Baru (Opsional)"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Existing documents */}
          {files.existingDocuments?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Dokumen saat ini:</p>
              <ul className="space-y-2">
                {files.existingDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <DocumentIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{doc.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Document upload */}
          <div className="mt-4">
            <FileUpload
              label="Upload Dokumen Baru (Opsional)"
              name="documents"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={handleFileChange}
            />
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard/residents')}
          >
            Batal
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            Simpan
          </Button>
        </div>
      </form>

      {/* Add ImageModal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={files.existingPhoto ? `${import.meta.env.VITE_API_URL}${files.existingPhoto.path}` : ''}
      />
    </div>
  )
}

export default EditResident 
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

const ResidentForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true)
        const response = await api.get('/rooms')
        
        // Filter kamar yang masih tersedia
        const availableRooms = response.data.filter(room => room.available > 0)
        
        setRooms(availableRooms.map(room => ({
          value: room.id.toString(),
          label: `${room.number} - ${room.gender} (Lantai ${room.floor}) - ${room.available} tempat tersedia`
        })))
      } catch (error) {
        console.error('Error fetching rooms:', error)
        setError('Gagal mengambil data kamar')
      } finally {
        setLoadingRooms(false)
      }
    }
    fetchRooms()
  }, [])

  const [formData, setFormData] = useState({
    // Data Pribadi
    name: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    address: '',
    phone: '',
    
    // Data Pendidikan
    education: 'SD',
    schoolName: '',
    grade: '',
    major: '',
    
    // Data Bantuan
    assistance: 'YAYASAN',
    details: '',
    
    // Room
    roomId: '',
    
    // File
    photo: null,
    documents: []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()

      // Format data dasar
      const dataToSend = {
        name: formData.name,
        nik: formData.nik,
        birthPlace: formData.birthPlace,
        birthDate: new Date(formData.birthDate + 'T00:00:00Z').toISOString(),
        gender: formData.gender,
        address: formData.address,
        phone: formData.phone || null,
        education: formData.education,
        schoolName: formData.schoolName,
        grade: formData.grade || null,
        major: formData.major || null,
        assistance: formData.assistance,
        details: formData.details || null,
        room: {
          connect: {
            id: parseInt(formData.roomId)
          }
        }
      }

      // Log untuk debugging
      console.log('Data yang akan dikirim:', dataToSend)

      // Append data as JSON string
      formDataToSend.append('data', JSON.stringify(dataToSend))

      // Append photo if exists
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo)
      }

      // Append documents if exist
      if (formData.documents?.length) {
        formData.documents.forEach(doc => {
          formDataToSend.append('documents', doc)
        })
      }

      const response = await api.post('/residents', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Response:', response.data)
      navigate('/dashboard/residents')
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard/residents')
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
        />
      )}

      <Card title="Form Penghuni">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Data Pribadi */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Data Pribadi</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Nama Lengkap"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                required
              />
              <Input
                label="NIK"
                value={formData.nik}
                onChange={(e) => setFormData(prev => ({...prev, nik: e.target.value}))}
                required
              />
              <Input
                label="Tempat Lahir"
                value={formData.birthPlace}
                onChange={(e) => setFormData(prev => ({...prev, birthPlace: e.target.value}))}
                required
              />
              <Input
                type="date"
                label="Tanggal Lahir"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({...prev, birthDate: e.target.value}))}
                required
              />
              <Select
                label="Jenis Kelamin"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
                options={[
                  { value: 'MALE', label: 'Laki-laki' },
                  { value: 'FEMALE', label: 'Perempuan' }
                ]}
                required
              />
              <Input
                label="No. Telepon"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
              />
            </div>
            <Textarea
              label="Alamat Lengkap"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
              required
            />
          </div>

          {/* Data Pendidikan */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Data Pendidikan</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Select
                label="Jenjang Pendidikan"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({...prev, education: e.target.value}))}
                options={[
                  { value: 'TK', label: 'TK' },
                  { value: 'SD', label: 'SD' },
                  { value: 'SMP', label: 'SMP' },
                  { value: 'SMA', label: 'SMA' },
                  { value: 'KULIAH', label: 'Kuliah' },
                  { value: 'MAGANG', label: 'Magang' }
                ]}
                required
              />
              <Input
                label="Nama Sekolah"
                value={formData.schoolName}
                onChange={(e) => setFormData(prev => ({...prev, schoolName: e.target.value}))}
                required
              />
              <Input
                label="Kelas/Tingkat"
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({...prev, grade: e.target.value}))}
              />
              <Input
                label="Jurusan"
                value={formData.major}
                onChange={(e) => setFormData(prev => ({...prev, major: e.target.value}))}
              />
            </div>
          </div>

          {/* Data Bantuan */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Data Bantuan</h3>
            <div className="grid grid-cols-1 gap-6">
              <Select
                label="Jenis Bantuan"
                value={formData.assistance}
                onChange={(e) => setFormData(prev => ({...prev, assistance: e.target.value}))}
                options={[
                  { value: 'YAYASAN', label: 'Yayasan' },
                  { value: 'DIAKONIA', label: 'Diakonia' }
                ]}
                required
              />
              <Textarea
                label="Detail Bantuan"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({...prev, details: e.target.value}))}
              />
            </div>
          </div>

          {/* Kamar */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Penempatan Kamar</h3>
            <div className="space-y-2">
              <Select
                label="Pilih Kamar"
                value={formData.roomId}
                onChange={(e) => setFormData(prev => ({...prev, roomId: e.target.value}))}
                options={rooms}
                required
                disabled={loadingRooms}
                placeholder={loadingRooms ? "Memuat data kamar..." : "Pilih kamar yang tersedia"}
              />
              {loadingRooms ? (
                <p className="text-sm text-gray-500">Sedang memuat data kamar...</p>
              ) : rooms.length === 0 ? (
                <p className="text-sm text-red-500">Tidak ada kamar yang tersedia saat ini</p>
              ) : (
                <p className="text-sm text-gray-500">
                  Silakan pilih kamar sesuai dengan jenis kelamin penghuni
                </p>
              )}
            </div>
          </div>

          {/* Dokumen */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Dokumen</h3>
            <div className="space-y-4">
              <FileUpload
                label="Foto"
                accept="image/*"
                onChange={(e) => setFormData(prev => ({...prev, photo: e.target.files[0]}))}
                required
              />
              <FileUpload
                label="Dokumen Pendukung"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={(e) => setFormData(prev => ({...prev, documents: Array.from(e.target.files)}))}
                help="KTP, Kartu Keluarga, dll (PDF/DOC)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
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
      </Card>
    </div>
  )
}

export default ResidentForm 
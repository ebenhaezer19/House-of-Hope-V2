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

const EditResident = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  
  // Tambahkan state untuk files
  const [files, setFiles] = useState({
    photo: null,
    documents: []
  })

  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    address: '',
    phone: '',
    education: 'SD',
    schoolName: '',
    grade: '',
    major: '',
    assistance: 'YAYASAN',
    details: '',
    roomId: ''
  })

  // Fetch resident data
  useEffect(() => {
    const fetchResident = async () => {
      try {
        const response = await api.get(`/residents/${id}`)
        const resident = response.data
        
        setFormData({
          name: resident.name,
          nik: resident.nik,
          birthPlace: resident.birthPlace,
          birthDate: resident.birthDate.split('T')[0],
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
          photo: null,
          documents: []
        })
      } catch (error) {
        console.error('Error fetching resident:', error)
        setError('Gagal mengambil data penghuni')
      }
    }

    fetchResident()
  }, [id])

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true)
        const response = await api.get('/rooms')
        setRooms(response.data.map(room => ({
          value: room.id.toString(),
          label: `${room.number} - ${room.type} (Lantai ${room.floor})`
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

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target
    
    console.log('File upload:', {
      name,
      files: uploadedFiles,
      count: uploadedFiles?.length,
      type: uploadedFiles[0]?.type
    })

    if (name === 'photo') {
      if (uploadedFiles[0]) {
        // Validasi tipe file
        if (!uploadedFiles[0].type.startsWith('image/')) {
          setError('File foto harus berupa gambar')
          return
        }
        
        setFiles(prev => ({
          ...prev,
          photo: uploadedFiles[0]
        }))
      }
    } else if (name === 'documents') {
      // Validasi tipe file
      const validFiles = Array.from(uploadedFiles).filter(file => {
        const validTypes = ['.pdf', '.doc', '.docx']
        return validTypes.some(type => file.name.toLowerCase().endsWith(type))
      })

      if (validFiles.length !== uploadedFiles.length) {
        setError('Beberapa file tidak valid. Hanya file PDF dan DOC yang diperbolehkan.')
        return
      }

      setFiles(prev => ({
        ...prev,
        documents: validFiles
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = new FormData()
      
      // Format data dasar
      const residentData = {
        name: formData.name,
        nik: formData.nik,
        birthPlace: formData.birthPlace,
        birthDate: formData.birthDate ? formData.birthDate : null,
        gender: formData.gender,
        address: formData.address,
        phone: formData.phone || null,
        education: formData.education,
        schoolName: formData.schoolName,
        grade: formData.grade || null,
        major: formData.major || null,
        assistance: formData.assistance,
        details: formData.details || null,
        roomId: parseInt(formData.roomId)
      }

      console.log('Update data:', {
        id,
        data: residentData,
        files
      })

      // Append data as JSON string
      data.append('data', JSON.stringify(residentData))

      // Append photo if exists
      if (files.photo) {
        console.log('Appending new photo:', files.photo)
        data.append('photo', files.photo)
      }

      // Append documents if exist
      if (files.documents.length > 0) {
        console.log('Appending new documents:', files.documents)
        files.documents.forEach(file => {
          data.append('documents', file)
        })
      }

      // Kirim request
      const response = await api.put(`/residents/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Response:', response.data)

      // Show success message
      alert('Data berhasil diperbarui')
      
      // Redirect to residents page
      navigate('/dashboard/residents', { 
        state: { message: 'Data penghuni berhasil diperbarui' }
      })
    } catch (err) {
      console.error('Error updating resident:', err)
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Terjadi kesalahan saat memperbarui data'
      )
    } finally {
      setLoading(false)
    }
  }

  // Render form fields (sama seperti Form.jsx)
  return (
    <div className="space-y-6">
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
        />
      )}

      <Card title="Edit Data Penghuni">
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
            </div>
          </div>

          {/* Dokumen */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Dokumen</h3>
            <div className="space-y-4">
              <FileUpload
                label="Foto (Opsional)"
                accept="image/*"
                onChange={handleFileChange}
                name="photo"
                help="Biarkan kosong jika tidak ingin mengubah foto"
                error={error}
              />
              <FileUpload
                label="Dokumen Pendukung (Opsional)"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleFileChange}
                name="documents"
                help="Biarkan kosong jika tidak ingin mengubah dokumen"
                error={error}
              />
              
              {/* Preview foto yang dipilih */}
              {files.photo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Foto yang dipilih:</p>
                  <p className="text-sm font-medium">{files.photo.name}</p>
                </div>
              )}
              
              {/* Preview dokumen yang dipilih */}
              {files.documents.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Dokumen yang dipilih:</p>
                  <ul className="list-disc list-inside">
                    {files.documents.map((doc, index) => (
                      <li key={index} className="text-sm font-medium">{doc.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard/residents')}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default EditResident 
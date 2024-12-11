import { useState } from 'react'
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
    education_level: '', // TK/SD/SMP/SMA/Kuliah/Magang
    school_name: '',
    grade: '',
    major: '', // Untuk SMA/Kuliah
    university: '', // Untuk alumni kuliah
    internship_place: '', // Untuk magang
    
    // Data Bantuan
    assistance_type: '', // Yayasan/Diakonia
    assistance_detail: '',
    
    // Data Orang Tua/Wali
    father_name: '',
    father_occupation: '',
    father_phone: '',
    mother_name: '',
    mother_occupation: '',
    mother_phone: '',
    guardian_name: '',
    guardian_relation: '',
    guardian_phone: '',
    
    // Status dan Dokumen
    status: 'active', // active/internship/alumni
    photo: null,
    documents: [] // KTP, Kartu Keluarga, dll
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle submit
  }

  // Opsi untuk dropdown
  const educationLevels = [
    { value: 'tk', label: 'TK' },
    { value: 'sd', label: 'SD' },
    { value: 'smp', label: 'SMP' },
    { value: 'sma', label: 'SMA' },
    { value: 'kuliah', label: 'Kuliah' },
    { value: 'magang', label: 'Magang' }
  ]

  const assistanceTypes = [
    { value: 'yayasan', label: 'Yayasan' },
    { value: 'diakonia', label: 'Diakonia Sekolah' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Aktif' },
    { value: 'internship', label: 'Magang' },
    { value: 'alumni', label: 'Alumni' }
  ]

  return (
    <div className="space-y-6">
      <Alert
        type="info"
        title="Informasi"
        message="Pastikan semua data diisi dengan lengkap dan benar"
      />

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
                  { value: 'male', label: 'Laki-laki' },
                  { value: 'female', label: 'Perempuan' }
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
                value={formData.education_level}
                onChange={(e) => setFormData(prev => ({...prev, education_level: e.target.value}))}
                options={educationLevels}
                required
              />
              <Input
                label="Nama Sekolah/Institusi"
                value={formData.school_name}
                onChange={(e) => setFormData(prev => ({...prev, school_name: e.target.value}))}
                required
              />
              <Input
                label="Kelas/Tingkat"
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({...prev, grade: e.target.value}))}
              />
              {['sma', 'kuliah'].includes(formData.education_level) && (
                <Input
                  label="Jurusan"
                  value={formData.major}
                  onChange={(e) => setFormData(prev => ({...prev, major: e.target.value}))}
                />
              )}
              {formData.education_level === 'kuliah' && (
                <Input
                  label="Universitas"
                  value={formData.university}
                  onChange={(e) => setFormData(prev => ({...prev, university: e.target.value}))}
                />
              )}
              {formData.education_level === 'magang' && (
                <Input
                  label="Tempat Magang"
                  value={formData.internship_place}
                  onChange={(e) => setFormData(prev => ({...prev, internship_place: e.target.value}))}
                />
              )}
            </div>
          </div>

          {/* Data Bantuan */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Data Bantuan</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Select
                label="Jenis Bantuan"
                value={formData.assistance_type}
                onChange={(e) => setFormData(prev => ({...prev, assistance_type: e.target.value}))}
                options={assistanceTypes}
                required
              />
              <Textarea
                label="Detail Bantuan"
                value={formData.assistance_detail}
                onChange={(e) => setFormData(prev => ({...prev, assistance_detail: e.target.value}))}
              />
            </div>
          </div>

          {/* Data Orang Tua/Wali */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Data Orang Tua/Wali</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Nama Ayah"
                value={formData.father_name}
                onChange={(e) => setFormData(prev => ({...prev, father_name: e.target.value}))}
              />
              <Input
                label="Pekerjaan Ayah"
                value={formData.father_occupation}
                onChange={(e) => setFormData(prev => ({...prev, father_occupation: e.target.value}))}
              />
              <Input
                label="No. Telepon Ayah"
                value={formData.father_phone}
                onChange={(e) => setFormData(prev => ({...prev, father_phone: e.target.value}))}
              />
              <Input
                label="Nama Ibu"
                value={formData.mother_name}
                onChange={(e) => setFormData(prev => ({...prev, mother_name: e.target.value}))}
              />
              <Input
                label="Pekerjaan Ibu"
                value={formData.mother_occupation}
                onChange={(e) => setFormData(prev => ({...prev, mother_occupation: e.target.value}))}
              />
              <Input
                label="No. Telepon Ibu"
                value={formData.mother_phone}
                onChange={(e) => setFormData(prev => ({...prev, mother_phone: e.target.value}))}
              />
              <Input
                label="Nama Wali (jika ada)"
                value={formData.guardian_name}
                onChange={(e) => setFormData(prev => ({...prev, guardian_name: e.target.value}))}
              />
              <Input
                label="Hubungan dengan Wali"
                value={formData.guardian_relation}
                onChange={(e) => setFormData(prev => ({...prev, guardian_relation: e.target.value}))}
              />
              <Input
                label="No. Telepon Wali"
                value={formData.guardian_phone}
                onChange={(e) => setFormData(prev => ({...prev, guardian_phone: e.target.value}))}
              />
            </div>
          </div>

          {/* Status dan Dokumen */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Status dan Dokumen</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                options={statusOptions}
                required
              />
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
            <Button variant="secondary">Batal</Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ResidentForm 
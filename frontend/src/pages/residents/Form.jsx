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

const ResidentForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [roomError, setRoomError] = useState(null)
  const [files, setFiles] = useState({
    photo: null,
    documents: [],
    existingPhoto: null,
    existingDocuments: []
  })
  
  const [masterData, setMasterData] = useState({
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
  });

  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const response = await api.get('/api/rooms');
        
        const availableRooms = response.data.map(room => ({
          value: room.id.toString(),
          label: `${room.number} - Lantai ${room.floor} (${room.availableSpace}/${room.capacity})`,
          isDisabled: room.availableSpace === 0
        }));

        setRooms(availableRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRoomError('Gagal memuat data kamar');
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchResidentData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api.get(`/api/residents/${id}`);
        const resident = response.data;

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
        });

        const existingPhoto = resident.documents?.find(doc => doc.type === 'photo');
        const existingDocs = resident.documents?.filter(doc => doc.type === 'document');

        setFiles(prev => ({
          ...prev,
          existingPhoto: existingPhoto,
          existingDocuments: existingDocs
        }));

      } catch (error) {
        console.error('Error fetching resident:', error);
        setError('Gagal memuat data penghuni');
      } finally {
        setLoading(false);
      }
    };

    fetchResidentData();
  }, [id]);

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
    documents: [],
    
    // Status - default ke NEW untuk penghuni baru
    status: 'NEW',
    exitDate: '',
    alumniNotes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    console.log('Form change:', { name, value });
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Khusus untuk status ALUMNI
      if (name === 'status') {
        if (value !== 'ALUMNI') {
          // Reset alumni fields jika status bukan ALUMNI
          newData.exitDate = '';
          newData.alumniNotes = '';
        }
      }

      return newData;
    });
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target
    
    console.log('File upload:', {
      name,
      files: uploadedFiles,
      count: uploadedFiles?.length
    })

    if (name === 'photo') {
      setFiles(prev => ({
        ...prev,
        photo: uploadedFiles[0]
      }))
    } else if (name === 'documents') {
      setFiles(prev => ({
        ...prev,
        documents: Array.from(uploadedFiles)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validasi NIK
      if (formData.nik.length !== 16) {
        throw new Error('NIK harus 16 digit');
      }

      // Validasi format NIK (hanya angka)
      if (!/^\d+$/.test(formData.nik)) {
        throw new Error('NIK hanya boleh berisi angka');
      }

      // Validasi semua field wajib
      const requiredFields = {
        name: 'Nama',
        nik: 'NIK',
        birthPlace: 'Tempat Lahir',
        birthDate: 'Tanggal Lahir',
        gender: 'Jenis Kelamin',
        address: 'Alamat',
        education: 'Pendidikan',
        schoolName: 'Nama Sekolah',
        assistance: 'Jenis Bantuan',
        roomId: 'Kamar',
        status: 'Status'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !formData[key])
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        throw new Error(`Field berikut harus diisi: ${missingFields.join(', ')}`);
      }

      // Validasi khusus untuk alumni
      if (formData.status === 'ALUMNI') {
        if (!formData.exitDate || !formData.alumniNotes) {
          throw new Error('Mohon lengkapi data alumni');
        }
      }

      // Siapkan FormData
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(formData));
      
      if (files.photo) {
        formDataToSend.append('photo', files.photo);
      }
      
      files.documents?.forEach(doc => {
        formDataToSend.append('documents', doc);
      });

      // Kirim ke API berdasarkan mode
      const url = isEditMode ? `/api/residents/${id}` : '/api/residents';
      const method = isEditMode ? 'put' : 'post';

      await api[method](url, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/dashboard/residents', {
        state: { 
          message: `Data penghuni berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}`
        }
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle specific errors
      if (error.response?.data?.error?.includes('Unique constraint failed')) {
        setError('NIK sudah terdaftar. Silakan gunakan NIK lain.');
      } else {
        setError(error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/residents')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? 'Edit Penghuni' : 'Tambah Penghuni Baru'}
      </h2>

      {error && <Alert type="error" message={error} />}

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
              onChange={(e) => {
                // Hanya terima input angka
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 16) {
                  handleChange({
                    target: {
                      name: 'nik',
                      value
                    }
                  });
                }
              }}
              required
              maxLength={16}
              pattern="\d*"
              placeholder="Masukkan 16 digit NIK"
              help="NIK harus 16 digit angka"
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
            <Input
              label="Alamat Lengkap"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              multiline
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
              placeholder="Masukkan nama sekolah"
            />

            <Input
              label="Kelas/Tingkat"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="Contoh: Kelas 2 / Semester 3"
            />

            <Input
              label="Jurusan"
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="Opsional"
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

            <Input
              label="Keterangan Bantuan"
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Tambahkan keterangan jika ada"
              multiline
            />
          </div>
        </Card>

        {/* Penempatan Kamar */}
        <div className="bg-white p-6 rounded-lg shadow">
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
          {roomError && <p className="text-red-500 text-sm mt-1">{roomError}</p>}
        </div>

        {/* Status Penghuni */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Status Penghuni</h3>
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
            <div className="mt-4 space-y-4">
              <Input
                type="date"
                label="Tanggal Keluar"
                name="exitDate"
                value={formData.exitDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Keterangan Alumni"
                name="alumniNotes"
                value={formData.alumniNotes}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>

        {/* Tambahkan preview foto yang sudah ada */}
        {files.existingPhoto && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Foto saat ini:</p>
            <img 
              src={`${import.meta.env.VITE_API_URL}${files.existingPhoto.path}`}
              alt="Foto penghuni"
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Tambahkan list dokumen yang sudah ada */}
        {files.existingDocuments?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Dokumen saat ini:</p>
            <ul className="mt-2 space-y-2">
              {files.existingDocuments.map((doc, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <DocumentIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{doc.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

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
    </div>
  )
}

export default ResidentForm 
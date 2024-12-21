import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Alert, Button, Card, Input, Select } from '../../components/shared'

const FacilityForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    status: 'available',
    image: '',
    description: '',
    location: '',
    maintenanceSchedule: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      console.log('Submitting facility data:', formData)

      const response = await api.post('/api/facilities', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('Facility created:', response.data)

      navigate('/dashboard/facilities', {
        state: { message: 'Fasilitas berhasil ditambahkan' }
      })
    } catch (error) {
      console.error('Error creating facility:', error)
      setError(
        error.response?.data?.message || 
        'Gagal menambahkan fasilitas. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tambah Fasilitas</h2>

      {error && <Alert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Nama Fasilitas"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Select
              label="Tipe"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Tipe</option>
              <option value="Study Room">Ruang Belajar</option>
              <option value="Computer Lab">Lab Komputer</option>
              <option value="Multi-purpose Hall">Aula</option>
              <option value="Library">Perpustakaan</option>
              <option value="Meeting Room">Ruang Rapat</option>
            </Select>

            <Input
              label="Kapasitas"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
            />

            <Input
              label="Lokasi"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Contoh: Lantai 1"
            />

            <Input
              label="URL Gambar"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="available">Tersedia</option>
              <option value="maintenance">Maintenance</option>
              <option value="booked">Terpakai</option>
            </Select>
          </div>

          <div className="mt-4">
            <Input
              label="Jadwal Maintenance"
              name="maintenanceSchedule"
              value={formData.maintenanceSchedule}
              onChange={handleChange}
              placeholder="Contoh: Setiap Minggu"
            />
          </div>

          <div className="mt-4">
            <Input
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Deskripsi fasilitas..."
            />
          </div>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard/facilities')}
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

export default FacilityForm 
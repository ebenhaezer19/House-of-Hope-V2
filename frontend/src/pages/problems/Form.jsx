import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProblemForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle submit logic here
    console.log('Form submitted:', formData)
  }

  const handleCancel = () => {
    navigate('/dashboard/problems') // Navigasi kembali ke halaman problems
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Laporkan Masalah</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Judul Masalah
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Fasilitas">Fasilitas</option>
              <option value="Peralatan">Peralatan</option>
              <option value="Akademik">Akademik</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prioritas
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Pilih Prioritas</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deskripsi Masalah
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProblemForm 
import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Pagination,
  SearchInput,
  Select,
  Table,
  Textarea,
  FileUpload
} from '../../components/shared'

const ResidentsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFullViewOpen, setIsFullViewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Data dummy untuk residents
  const residents = [
    {
      id: 1,
      name: 'John Doe',
      room: 'L-01',
      education: 'SMA',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      room: 'P-01', 
      education: 'SMP',
      status: 'inactive'
    }
  ]

  // Kolom untuk tabel utama (ringkas)
  const columns = [
    { header: 'Nama', accessor: 'name' },
    { header: 'Kamar', accessor: 'room' },
    { header: 'Pendidikan', accessor: 'education' },
    { 
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge 
          variant={row.status === 'active' ? 'success' : 'danger'}
        >
          {row.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      )
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          <Button variant="danger" size="sm">
            Hapus
          </Button>
        </div>
      )
    }
  ]

  // Kolom untuk view lengkap (tetap sama)
  const fullColumns = [
    { header: 'Nama', accessor: 'name' },
    { header: 'Kamar', accessor: 'room' },
    { header: 'Pendidikan', accessor: 'education' },
    { header: 'NIK', accessor: 'nik' },
    { header: 'Tempat Lahir', accessor: 'birthplace' },
    { header: 'Tanggal Lahir', accessor: 'birthdate' },
    { header: 'Jenis Kelamin', accessor: 'gender' },
    { header: 'No. Telepon', accessor: 'phone' },
    { header: 'Alamat', accessor: 'address' },
    { 
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge 
          variant={row.status === 'active' ? 'success' : 'danger'}
        >
          {row.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      )
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          <Button variant="danger" size="sm">
            Hapus
          </Button>
        </div>
      )
    }
  ]

  // Data dummy yang lebih lengkap
  const fullResidents = [
    {
      id: 1,
      name: 'John Doe',
      room: 'L-01',
      education: 'SMA',
      status: 'active',
      nik: '1234567890123456',
      birthplace: 'Jakarta',
      birthdate: '2000-01-01',
      gender: 'Laki-laki',
      phone: '081234567890',
      address: 'Jl. Contoh No. 123, Jakarta'
    },
    // ... data lainnya
  ]

  const handleSaveDraft = (e) => {
    e.preventDefault()
    // Simpan ke localStorage atau state management
    // Tampilkan notifikasi
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Submit ke server
    // Tampilkan notifikasi
  }

  return (
    <div className="space-y-6">
      <Alert
        type="info"
        title="Info"
        message="Data akan diperbarui setiap 5 menit sekali"
      />

      <Card
        title="Daftar Penghuni"
        actions={
          <div className="flex space-x-4">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Cari penghuni..."
              className="text-lg w-96" 
            />
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'active', label: 'Aktif' },
                { value: 'inactive', label: 'Tidak Aktif' }
              ]}
            />
            <Button onClick={() => setIsModalOpen(true)}>
              Tambah Penghuni
            </Button>
            <Button 
              variant="secondary"
              onClick={() => setIsFullViewOpen(true)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                />
              </svg>
              Lihat Semua Data
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          data={residents}
          isLoading={isLoading}
          emptyMessage="Belum ada penghuni"
        />

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Penghuni"
        size="xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Data Pribadi */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Data Pribadi</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                required
              />
              <Input
                label="NIK"
                placeholder="Masukkan NIK"
                required
              />
              <Input
                label="Tempat Lahir"
                placeholder="Masukkan tempat lahir"
                required
              />
              <Input
                type="date"
                label="Tanggal Lahir"
                required
              />
              <Select
                label="Jenis Kelamin"
                options={[
                  { value: 'male', label: 'Laki-laki' },
                  { value: 'female', label: 'Perempuan' }
                ]}
                required
              />
              <Input
                label="No. Telepon"
                placeholder="Masukkan no telepon"
              />
            </div>
            <Textarea
              label="Alamat Lengkap"
              placeholder="Masukkan alamat lengkap"
              required
            />
          </div>

          {/* Data Pendidikan */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Data Pendidikan</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Jenjang Pendidikan"
                options={[
                  { value: 'tk', label: 'TK' },
                  { value: 'sd', label: 'SD' },
                  { value: 'smp', label: 'SMP' },
                  { value: 'sma', label: 'SMA' },
                  { value: 'kuliah', label: 'Kuliah' },
                  { value: 'magang', label: 'Magang' }
                ]}
                required
              />
              <Input
                label="Nama Sekolah/Institusi"
                placeholder="Masukkan nama sekolah"
                required
              />
              <Input
                label="Kelas/Tingkat"
                placeholder="Masukkan kelas/tingkat"
              />
              <Select
                label="Kamar"
                options={[
                  { value: 'L-01', label: 'L-01' },
                  { value: 'L-02', label: 'L-02' },
                  { value: 'P-01', label: 'P-01' },
                  { value: 'P-02', label: 'P-02' }
                ]}
                required
              />
            </div>
          </div>

          {/* Data Bantuan */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Data Bantuan</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Jenis Bantuan"
                options={[
                  { value: 'yayasan', label: 'Yayasan' },
                  { value: 'diakonia', label: 'Diakonia Sekolah' }
                ]}
                required
              />
              <Textarea
                label="Detail Bantuan"
                placeholder="Masukkan detail bantuan"
              />
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Data Orang Tua/Wali</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Nama Ayah"
                placeholder="Masukkan nama ayah"
              />
              <Input
                label="No. Telepon Ayah"
                placeholder="Masukkan no telepon ayah"
              />
              <Input
                label="Nama Ibu"
                placeholder="Masukkan nama ibu"
              />
              <Input
                label="No. Telepon Ibu"
                placeholder="Masukkan no telepon ibu"
              />
            </div>
          </div>

          {/* Dokumen */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Dokumen</h3>
            <div className="grid grid-cols-1 gap-4">
              <FileUpload
                label="Foto"
                accept="image/*"
                required
              />
              <FileUpload
                label="Dokumen Pendukung"
                accept=".pdf,.doc,.docx"
                multiple
                help="KTP, Kartu Keluarga, dll (PDF/DOC)"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              * Data yang disimpan sementara dapat dilanjutkan nanti
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button 
                variant="secondary"
                type="button"
                onClick={handleSaveDraft}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" 
                  />
                </svg>
                Simpan Sementara
              </Button>
              <Button type="submit">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                Simpan & Selesai
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal Full View */}
      <Modal
        isOpen={isFullViewOpen}
        onClose={() => setIsFullViewOpen(false)}
        title="Data Lengkap Penghuni"
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penghuni..."
              className="w-96"
            />
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                Export Excel
              </Button>
              <Button variant="secondary" size="sm">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                Export PDF
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={fullColumns}
              data={fullResidents}
              isLoading={isLoading}
              emptyMessage="Tidak ada data penghuni"
            />
          </div>

          <div className="flex justify-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ResidentsList 
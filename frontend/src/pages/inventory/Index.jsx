import { useState } from 'react'
import { 
  ArchiveBoxIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  QrCodeIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('items') // items, stock, maintenance
  const [searchQuery, setSearchQuery] = useState('')

  // Data dummy untuk inventaris
  const inventory = [
    {
      id: 1,
      name: 'Kasur Single',
      category: 'Furniture',
      total_units: 50,
      available_units: 45,
      maintenance: 2,
      broken: 3,
      location: 'Gudang Utama',
      last_check: '2024-03-10',
      status: 'good',
      image: 'https://placehold.co/100x100'
    },
    {
      id: 2,
      name: 'Meja Belajar',
      category: 'Furniture',
      total_units: 40,
      available_units: 35,
      maintenance: 1,
      broken: 4,
      location: 'Gudang Utama',
      last_check: '2024-03-12',
      status: 'need_restock',
      image: 'https://placehold.co/100x100'
    }
  ]

  // Data dummy untuk riwayat maintenance
  const maintenanceHistory = [
    {
      id: 1,
      item_name: 'Kasur Single',
      type: 'repair',
      date: '2024-03-15',
      cost: 500000,
      technician: 'John Doe',
      status: 'completed',
      notes: 'Perbaikan per dan rangka'
    }
  ]

  // Data dummy untuk stok masuk/keluar
  const stockHistory = [
    {
      id: 1,
      item_name: 'Meja Belajar',
      type: 'in', // in/out
      quantity: 10,
      date: '2024-03-14',
      reference: 'PO-001',
      handler: 'Admin',
      notes: 'Pembelian baru'
    }
  ]

  const stats = {
    total_items: inventory.reduce((sum, item) => sum + item.total_units, 0),
    available_items: inventory.reduce((sum, item) => sum + item.available_units, 0),
    maintenance_items: inventory.reduce((sum, item) => sum + item.maintenance, 0),
    need_restock: inventory.filter(item => item.status === 'need_restock').length
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Inventaris</h1>
        <div className="mt-4 sm:mt-0 space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah Item
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <QrCodeIcon className="h-5 w-5 mr-2" />
            Scan QR
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArchiveBoxIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Item</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.total_items}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardDocumentListIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Item Tersedia</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.available_items}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowPathIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Dalam Maintenance</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.maintenance_items}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Perlu Restock</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.need_restock}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-4 w-full">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari inventaris..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mt-2 sm:mt-0 sm:flex sm:space-x-2">
              <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option>Semua Kategori</option>
                <option>Furniture</option>
                <option>Elektronik</option>
                <option>Peralatan</option>
              </select>
              <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option>Semua Lokasi</option>
                <option>Gudang Utama</option>
                <option>Gudang B</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'items', name: 'Daftar Inventaris' },
              { id: 'stock', name: 'Stok Masuk/Keluar' },
              { id: 'maintenance', name: 'Maintenance' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Daftar Inventaris */}
          {activeTab === 'items' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'good'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'good' ? 'Stok Baik' : 'Perlu Restock'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Unit</p>
                        <p className="font-medium">{item.total_units}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tersedia</p>
                        <p className="font-medium">{item.available_units}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Maintenance</p>
                        <p className="font-medium">{item.maintenance}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rusak</p>
                        <p className="font-medium">{item.broken}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Lokasi: {item.location}
                      </p>
                      <p className="text-sm text-gray-500">
                        Pengecekan Terakhir: {item.last_check}
                      </p>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stok Masuk/Keluar */}
          {activeTab === 'stock' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referensi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Petugas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockHistory.map((history) => (
                    <tr key={history.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {history.item_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          history.type === 'in'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {history.type === 'in' ? 'Masuk' : 'Keluar'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{history.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{history.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{history.reference}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{history.handler}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Maintenance */}
          {activeTab === 'maintenance' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Biaya
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teknisi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maintenanceHistory.map((history) => (
                    <tr key={history.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {history.item_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{history.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{history.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Rp {history.cost.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{history.technician}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          history.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {history.status === 'completed' ? 'Selesai' : 'Proses'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InventoryManagement 
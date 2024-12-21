import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const DetailModal = ({ isOpen, onClose, facility }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Detail Fasilitas
                </Dialog.Title>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="mt-4">
                  {/* Gambar Fasilitas */}
                  {facility.image && (
                    <img
                      src={facility.image}
                      alt={facility.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}

                  {/* Informasi Fasilitas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nama</p>
                      <p className="text-base text-gray-900">{facility.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipe</p>
                      <p className="text-base text-gray-900">{facility.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Kapasitas</p>
                      <p className="text-base text-gray-900">{facility.capacity} orang</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        facility.status === 'available' 
                          ? 'bg-green-100 text-green-800'
                          : facility.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {facility.status === 'available' ? 'Tersedia' :
                         facility.status === 'maintenance' ? 'Maintenance' : 'Terpakai'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lokasi</p>
                      <p className="text-base text-gray-900">{facility.location || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Jadwal Maintenance</p>
                      <p className="text-base text-gray-900">{facility.maintenanceSchedule || '-'}</p>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Deskripsi</p>
                    <p className="text-base text-gray-900">{facility.description || '-'}</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DetailModal 
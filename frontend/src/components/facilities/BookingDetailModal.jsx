import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const BookingDetailModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

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
                  Detail Booking
                </Dialog.Title>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fasilitas</p>
                      <p className="text-base text-gray-900">{booking?.facilityName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Penghuni</p>
                      <p className="text-base text-gray-900">{booking?.resident?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Waktu Mulai</p>
                      <p className="text-base text-gray-900">
                        {booking?.startTime ? 
                          new Date(booking.startTime).toLocaleString('id-ID', {
                            dateStyle: 'long',
                            timeStyle: 'short'
                          }) : '-'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Waktu Selesai</p>
                      <p className="text-base text-gray-900">
                        {booking?.endTime ? 
                          new Date(booking.endTime).toLocaleString('id-ID', {
                            dateStyle: 'long',
                            timeStyle: 'short'
                          }) : '-'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking?.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : booking?.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking?.status === 'approved' ? 'Disetujui' :
                         booking?.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Tujuan</p>
                    <p className="text-base text-gray-900">{booking?.purpose || '-'}</p>
                  </div>

                  {booking?.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">Catatan</p>
                      <p className="text-base text-gray-900">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BookingDetailModal 
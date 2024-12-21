import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Alert, Button, Input, Select } from '../shared'
import api from '../../services/api'

const BookingModal = ({ isOpen, onClose, facility, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [residents, setResidents] = useState([])
  const [formData, setFormData] = useState({
    residentId: '',
    startTime: '',
    endTime: '',
    purpose: '',
    notes: ''
  })

  // Fetch residents for dropdown
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await api.get('/api/residents')
        setResidents(response.data)
      } catch (error) {
        console.error('Error fetching residents:', error)
        setError('Gagal memuat data penghuni')
      }
    }

    if (isOpen) {
      fetchResidents()
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)

      const response = await api.post(`/api/facilities/${facility.id}/bookings`, formData)
      console.log('Booking created:', response.data)
      
      // Reset form
      setFormData({
        residentId: '',
        startTime: '',
        endTime: '',
        purpose: '',
        notes: ''
      })

      // Notify parent component to refresh data
      if (onSuccess) {
        onSuccess()
      }
      
      onClose()
    } catch (error) {
      console.error('Error booking facility:', error)
      setError(error.response?.data?.message || 'Gagal membuat booking')
    } finally {
      setLoading(false)
    }
  }

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Booking Fasilitas: {facility.name}
                </Dialog.Title>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {error && (
                  <Alert type="error" message={error} className="mt-4" />
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <Select
                    label="Penghuni"
                    name="residentId"
                    value={formData.residentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Penghuni</option>
                    {residents.map(resident => (
                      <option key={resident.id} value={resident.id}>
                        {resident.name}
                      </option>
                    ))}
                  </Select>

                  <Input
                    type="datetime-local"
                    label="Waktu Mulai"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    type="datetime-local"
                    label="Waktu Selesai"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Tujuan"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Catatan"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    multiline
                  />

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                    >
                      Booking
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default BookingModal 
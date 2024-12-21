import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Alert, Button, Input, Select } from '../shared'
import api from '../../services/api'

const EditMaintenanceModal = ({ isOpen, onClose, maintenanceLog, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    notes: ''
  })

  useEffect(() => {
    if (maintenanceLog) {
      console.log('Setting form data from:', maintenanceLog);
      
      setFormData({
        type: maintenanceLog.type || '',
        description: maintenanceLog.description || '',
        startDate: maintenanceLog.startDate || '',
        endDate: maintenanceLog.endDate || '',
        status: maintenanceLog.status || '',
        notes: maintenanceLog.notes || ''
      });
    }
  }, [maintenanceLog]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Helper function untuk memastikan tanggal valid
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        return date.toISOString();
      };

      const submitData = {
        ...formData,
        startDate: formatDate(formData.startDate),
        endDate: formData.endDate ? formatDate(formData.endDate) : null
      };

      console.log('Submitting update:', submitData);
      await api.put(`/api/facilities/maintenance/${maintenanceLog.id}`, submitData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating maintenance log:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Gagal mengupdate log maintenance'
      );
    } finally {
      setLoading(false);
    }
  };

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
                  Edit Log Maintenance
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
                    label="Tipe Maintenance"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="routine">Rutin</option>
                    <option value="repair">Perbaikan</option>
                  </Select>

                  <Input
                    label="Deskripsi"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    multiline
                    rows={3}
                  />

                  <Input
                    type="date"
                    label="Tanggal Mulai"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    type="date"
                    label="Tanggal Selesai"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />

                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">Dalam Proses</option>
                    <option value="completed">Selesai</option>
                  </Select>

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
                      Simpan
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

export default EditMaintenanceModal
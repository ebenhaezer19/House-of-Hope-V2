import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Input, Select, Button, Alert } from '../../components/shared'
import api from '../../services/api'

const PaymentForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const residentId = searchParams.get('residentId')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [residents, setResidents] = useState([])
  
  const [formData, setFormData] = useState({
    residentId: residentId || '',
    amount: '',
    type: 'MONTHLY', // MONTHLY, DEPOSIT, etc
    status: 'PAID', // PAID, PENDING, UNPAID
    notes: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch residents for dropdown
        console.log('Fetching residents...');
        const residentsResponse = await api.get('/api/residents')
        console.log('Residents data:', residentsResponse.data);
        setResidents(residentsResponse.data)

        // If editing, fetch payment data
        if (id) {
          console.log('Fetching payment data for ID:', id);
          const paymentResponse = await api.get(`/api/payments/${id}`)
          console.log('Payment data:', paymentResponse.data);
          const payment = paymentResponse.data
          
          setFormData({
            residentId: payment.residentId.toString(),
            amount: payment.amount.toString(),
            type: payment.type,
            status: payment.status,
            notes: payment.notes || ''
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'Gagal memuat data')
      }
    }

    fetchData()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('Form change:', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Form data before submit:', formData);
      
      // Validasi data
      if (!formData.residentId || !formData.amount || !formData.type || !formData.status) {
        throw new Error('Semua field harus diisi');
      }

      const payload = {
        residentId: parseInt(formData.residentId),
        amount: parseFloat(formData.amount),
        type: formData.type,
        status: formData.status,
        notes: formData.notes || ''
      }
      
      console.log('Payload to submit:', payload);
      let response;

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (id) {
        console.log('Updating payment with ID:', id);
        // Pastikan ID valid
        if (!id || isNaN(Number(id))) {
          throw new Error('ID pembayaran tidak valid');
        }
        response = await api.put(`/api/payments/${id}`, payload, config);
        console.log('Update response:', response.data);
      } else {
        console.log('Creating new payment');
        response = await api.post('/api/payments', payload, config);
        console.log('Create response:', response.data);
      }

      navigate('/dashboard/payments', { 
        state: { 
          message: `Pembayaran berhasil ${id ? 'diupdate' : 'ditambahkan'}`
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(
        error.response?.data?.message || 
        error.message ||
        'Gagal menyimpan data. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {id ? 'Edit Pembayaran' : 'Tambah Pembayaran'}
      </h2>

      {error && (
        <Alert 
          type="error"
          message={error}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <Select
          label="Penghuni"
          name="residentId"
          value={formData.residentId}
          onChange={handleChange}
          required
          disabled={!!residentId}
        >
          <option value="">Pilih Penghuni</option>
          {residents.map(resident => (
            <option key={resident.id} value={resident.id}>
              {resident.name} - Kamar {resident.room?.number || 'N/A'}
            </option>
          ))}
        </Select>

        <Input
          label="Jumlah"
          type="number"
          name="amount" 
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
          step="1000"
          placeholder="Masukkan jumlah pembayaran"
        />

        <Select
          label="Tipe Pembayaran"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="MONTHLY">Bulanan</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="OTHER">Lainnya</option>
        </Select>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="PAID">Lunas</option>
          <option value="PENDING">Pending</option>
          <option value="UNPAID">Belum Bayar</option>
        </Select>

        <Input
          label="Keterangan"
          type="text"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Tambahkan keterangan (opsional)"
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Batal
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {id ? 'Update' : 'Simpan'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PaymentForm 
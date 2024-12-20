import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { Alert, Button } from '../../components/shared'

const PaymentIndex = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [searchParams] = useSearchParams();
  const residentId = searchParams.get('residentId');
  const [resident, setResident] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch resident data if residentId exists
      if (residentId) {
        console.log('Fetching resident data for ID:', residentId);
        const residentResponse = await api.get(`/api/residents/${residentId}`);
        setResident(residentResponse.data);
      }

      // Fetch payments
      const url = residentId 
        ? `/api/payments?residentId=${residentId}`
        : '/api/payments';

      console.log('Fetching payments from:', url);
      const response = await api.get(url);
      console.log('Payments data:', response.data);
      
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data pembayaran');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [residentId]);

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) return;
    
    try {
      setDeleteError(null);
      await api.delete(`/api/payments/${id}`);
      setSuccessMessage('Pembayaran berhasil dihapus');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting payment:', error);
      setDeleteError(
        error.response?.data?.message || 
        'Gagal menghapus pembayaran'
      );
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-10">Memuat data...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {resident ? `Pembayaran - ${resident.name}` : 'Daftar Pembayaran'}
        </h1>
        <Link
          to={residentId ? `/dashboard/payments/create?residentId=${residentId}` : '/dashboard/payments/create'}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Tambah Pembayaran
        </Link>
      </div>

      {/* Messages */}
      {error && (
        <Alert type="error" message={error} />
      )}
      {deleteError && (
        <Alert type="error" message={deleteError} />
      )}
      {successMessage && (
        <Alert type="success" message={successMessage} />
      )}

      {/* Payments Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Penghuni
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keterangan
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payment.date).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.resident.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.type === 'MONTHLY' ? 'Bulanan' : 
                   payment.type === 'DEPOSIT' ? 'Deposit' : 'Lainnya'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'PAID' 
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status === 'PAID' ? 'Lunas' : 
                     payment.status === 'PENDING' ? 'Pending' : 'Belum Bayar'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.notes || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/dashboard/payments/${payment.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {payments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Belum ada data pembayaran</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentIndex; 
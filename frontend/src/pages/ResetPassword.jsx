import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/api.tsx'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validasi password
    if (newPassword !== confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Password baru dan konfirmasi password tidak sama'
      })
      setLoading(false)
      return
    }

    try {
      const response = await resetPassword({ 
        token: token,
        newPassword: newPassword 
      })
      
      console.log('Reset password response:', response)
      setStatus({
        type: 'success',
        message: response.data.message || 'Password berhasil diubah'
      })

      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (error) {
      console.error('Reset password error:', error)
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Terjadi kesalahan saat mengubah password'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masukkan password baru Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status.type === 'success' ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    {status.message}
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-green-700">
                      Anda akan dialihkan ke halaman login...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status.type === 'error' && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {status.message}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password Baru
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Konfirmasi Password Baru
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Reset Password'}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Kembali ke halaman login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword 
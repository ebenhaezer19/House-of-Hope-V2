import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { changePassword } from '../services/api'
import { config } from '../config'
import { toast } from 'react-hot-toast'

export default function Profile() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Password baru tidak cocok')
      return
    }

    try {
      setIsLoading(true)
      
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })
      
      toast.success('Password berhasil diubah')
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-sm">{success}</div>
        )}

        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
            Password Lama
          </label>
          <input
            id="oldPassword"
            type="password"
            required
            value={formData.oldPassword}
            onChange={handleChange}
            autoComplete="current-password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Password Baru
          </label>
          <input
            id="newPassword"
            type="password"
            required
            value={formData.newPassword}
            onChange={handleChange}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Konfirmasi Password Baru
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          {isLoading ? 'Mengubah password...' : 'Ubah Password'}
        </button>
      </div>
    </form>
  )
} 
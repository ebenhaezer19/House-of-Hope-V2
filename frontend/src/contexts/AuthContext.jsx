import { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setUser(null)
        return
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      const response = await api.get('/api/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ name, email, password }) => {
    try {
      setError(null)
      const response = await api.post('/api/auth/register', { name, email, password })
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      setError(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await api.post('/api/auth/login', { email, password })
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      setError(error.response?.data?.message || 'Login gagal')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 
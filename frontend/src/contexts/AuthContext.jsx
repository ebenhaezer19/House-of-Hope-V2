import { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setUser(null)
        setAuthenticated(false)
        setLoading(false)
        return
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      const response = await api.get('/api/auth/me')
      setUser(response.data.user)
      setAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setAuthenticated(false)
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
      setLoading(true)
      setError(null)
      
      const response = await api.post('/api/auth/login', { email, password })
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        
        setUser(response.data.user)
        setAuthenticated(true)
        
        navigate('/dashboard')
        return response.data
      }
    } catch (error) {
      console.error('Login error details:', error)
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Koneksi timeout - silakan coba lagi')
      }
      
      if (error.response?.status === 401) {
        throw new Error('Email atau password salah')
      }
      
      throw new Error(error.response?.data?.message || 'Gagal login')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setAuthenticated(false)
    navigate('/login')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      authenticated,
      loading,
      error,
      login, 
      logout, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 
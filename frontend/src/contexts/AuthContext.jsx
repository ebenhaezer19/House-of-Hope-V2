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

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Response:', error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 
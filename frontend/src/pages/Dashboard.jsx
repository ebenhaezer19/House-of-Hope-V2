import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard 
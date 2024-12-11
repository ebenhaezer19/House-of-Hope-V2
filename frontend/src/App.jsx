import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'

// Lazy load components
const Login = lazy(() => import('./pages/Login'))
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
import Residents from './pages/residents/Index'
import ResidentForm from './pages/residents/Form'
import Problems from './pages/problems/Index'
import ProblemForm from './pages/problems/Form'
import Tasks from './pages/tasks/Index'
import TaskForm from './pages/tasks/Form'
import Profile from './pages/Profile'
import RoomManagement from './pages/rooms/Index'
import RoomMap from './pages/rooms/Map'
import PaymentManagement from './pages/payments/Index'
import FacilityManagement from './pages/facilities/Index'
import SecurityManagement from './pages/security/Index'
import MaintenanceManagement from './pages/maintenance/Index'
import ReportingAnalytics from './pages/reports/Index'
import InventoryManagement from './pages/inventory/Index'
import AcademicManagement from './pages/academic/Index'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              {/* Penghuni Routes */}
              <Route path="residents" element={<Residents />} />
              <Route path="residents/create" element={<ResidentForm />} />
              <Route path="residents/:id/edit" element={<ResidentForm />} />
              
              {/* Masalah Routes */}
              <Route path="problems" element={<Problems />} />
              <Route path="problems/create" element={<ProblemForm />} />
              <Route path="problems/:id/edit" element={<ProblemForm />} />
              
              {/* Tugas Routes */}
              <Route path="tasks" element={<Tasks />} />
              <Route path="tasks/create" element={<TaskForm />} />
              <Route path="tasks/:id/edit" element={<TaskForm />} />
              
              {/* Room Management Routes */}
              <Route path="rooms" element={<RoomManagement />} />
              <Route path="rooms/map" element={<RoomMap />} />
              
              {/* Payment Routes */}
              <Route path="payments" element={<PaymentManagement />} />
              
              {/* Facility Routes */}
              <Route path="facilities" element={<FacilityManagement />} />
              
              {/* Security Routes */}
              <Route path="security" element={<SecurityManagement />} />
              
              {/* Maintenance Routes */}
              <Route path="maintenance" element={<MaintenanceManagement />} />
              
              {/* Reports Routes */}
              <Route path="reports" element={<ReportingAnalytics />} />
              
              {/* Inventory Routes */}
              <Route path="inventory" element={<InventoryManagement />} />
              
              {/* Academic Routes */}
              <Route path="academic" element={<AcademicManagement />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
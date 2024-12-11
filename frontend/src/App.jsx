import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'

// Lazy load components
const Login = lazy(() => import('./pages/Login'))
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Lazy load other components
const Residents = lazy(() => import('./pages/residents/Index'))
const ResidentForm = lazy(() => import('./pages/residents/Form'))
const Problems = lazy(() => import('./pages/problems/Index'))
const ProblemForm = lazy(() => import('./pages/problems/Form'))
const Tasks = lazy(() => import('./pages/tasks/Index'))
const TaskForm = lazy(() => import('./pages/tasks/Form'))
const RoomManagement = lazy(() => import('./pages/rooms/Index'))
const RoomMap = lazy(() => import('./pages/rooms/Map'))
const PaymentManagement = lazy(() => import('./pages/payments/Index'))
const FacilityManagement = lazy(() => import('./pages/facilities/Index'))
const SecurityManagement = lazy(() => import('./pages/security/Index'))
const MaintenanceManagement = lazy(() => import('./pages/maintenance/Index'))
const ReportingAnalytics = lazy(() => import('./pages/reports/Index'))
const InventoryManagement = lazy(() => import('./pages/inventory/Index'))
const AcademicManagement = lazy(() => import('./pages/academic/Index'))
const Profile = lazy(() => import('./pages/Profile'))
const Activities = lazy(() => import('./pages/activities/Index'))

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
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
              
              {/* Activities Routes */}
              <Route path="activities" element={<Activities />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
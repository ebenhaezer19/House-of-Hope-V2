import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ResidentForm from './pages/residents/Form';

// Import layouts
import DashboardLayout from './layouts/DashboardLayout';

// Import feature modules
import TaskIndex from './pages/tasks/Index';
import TaskForm from './pages/tasks/Form';
import ResidentIndex from './pages/residents/Index';
import RoomIndex from './pages/rooms/Index';
import PaymentIndex from './pages/payments/Index';
import FacilityIndex from './pages/facilities/Index';
import ProblemIndex from './pages/problems/Index';
import SecurityIndex from './pages/security/Index';
import MaintenanceIndex from './pages/maintenance/Index';
import ReportIndex from './pages/reports/Index';
import InventoryIndex from './pages/inventory/Index';
import AcademicIndex from './pages/academic/Index';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Outlet /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Feature Routes */}
            <Route path="tasks">
              <Route index element={<TaskIndex />} />
              <Route path="new" element={<TaskForm />} />
              <Route path=":id/edit" element={<TaskForm />} />
            </Route>
            
            {/* Residents Routes */}
            <Route path="residents">
              <Route index element={<ResidentIndex />} />
              <Route path="new" element={<ResidentForm />} />
              <Route path=":id/edit" element={<ResidentForm />} />
            </Route>
            
            {/* Other Routes */}
            <Route path="rooms" element={<RoomIndex />} />
            <Route path="payments" element={<PaymentIndex />} />
            <Route path="facilities" element={<FacilityIndex />} />
            <Route path="problems" element={<ProblemIndex />} />
            <Route path="security" element={<SecurityIndex />} />
            <Route path="maintenance" element={<MaintenanceIndex />} />
            <Route path="reports" element={<ReportIndex />} />
            <Route path="inventory" element={<InventoryIndex />} />
            <Route path="academic" element={<AcademicIndex />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
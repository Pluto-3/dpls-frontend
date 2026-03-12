import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RoleRoute from './components/RoleRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ApplicantDashboard from './pages/applicant/ApplicantDashboard'
import NewApplication from './pages/applicant/NewApplication'
import ApplicationDetail from './pages/applicant/ApplicationDetail'
import OfficerDashboard from './pages/officer/OfficerDashboard'
import ReviewApplication from './pages/officer/ReviewApplication'
import AdminDashboard from './pages/admin/AdminDashboard'
import Departments from './pages/admin/Departments'
import PermitTypes from './pages/admin/PermitTypes'
import VerifyPermit from './pages/public/VerifyPermit'
import ActivityLog from './pages/admin/ActivityLog'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyPermit />} />
          <Route path="/admin/activity-log" element={<RoleRoute role="ADMIN"><ActivityLog /></RoleRoute>} />
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center text-gray-600">
              Access Denied
            </div>
          } />

          {/* Applicant routes */}
          <Route path="/applicant" element={
            <RoleRoute role="APPLICANT"><ApplicantDashboard /></RoleRoute>
          } />
          <Route path="/applicant/new" element={
            <RoleRoute role="APPLICANT"><NewApplication /></RoleRoute>
          } />
          <Route path="/applicant/applications/:id" element={
            <RoleRoute role="APPLICANT"><ApplicationDetail /></RoleRoute>
          } />

          {/* Officer routes */}
          <Route path="/officer" element={
            <RoleRoute role="OFFICER"><OfficerDashboard /></RoleRoute>
          } />
          <Route path="/officer/applications/:id" element={
            <RoleRoute role="OFFICER"><ReviewApplication /></RoleRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <RoleRoute role="ADMIN"><AdminDashboard /></RoleRoute>
          } />
          <Route path="/admin/departments" element={
            <RoleRoute role="ADMIN"><Departments /></RoleRoute>
          } />
          <Route path="/admin/permit-types" element={
            <RoleRoute role="ADMIN"><PermitTypes /></RoleRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { LandingPage } from './pages/public/LandingPage';
import { Unauthorized } from './pages/public/Unauthorized';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { RequireAuth, RequireRole } from './components/common/RouteGuards';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ResourceList } from './pages/resources/ResourceList';
import { ResourceCalendar } from './pages/resources/ResourceCalendar';
import { SpecialBooking } from './pages/bookings/SpecialBooking';
import { MyBookings } from './pages/bookings/MyBookings';
import { FacultyMeeting } from './pages/bookings/FacultyMeeting';
import { ApprovalPanel } from './pages/dashboard/approvals/ApprovalPanel';

// Actual dashboards imported from their respective pages
import { StudentDashboard as StudentDashboardPage } from './pages/dashboard/student/StudentDashboard';
import { FacultyDashboard as FacultyDashboardPage } from './pages/dashboard/faculty/FacultyDashboard';
import { LabInChargeDashboard as LabInChargeDashboardPage } from './pages/dashboard/lab-in-charge/LabInChargeDashboard';
import { AdminDashboard as AdminDashboardPage } from './pages/dashboard/admin/AdminDashboard';
import { UserManagement } from './pages/dashboard/admin/UserManagement';
import { ResourceManagement } from './pages/dashboard/admin/ResourceManagement';
import { AuditLogs } from './pages/dashboard/admin/AuditLogs';
import { AllBookings } from './pages/dashboard/admin/AllBookings';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        {/* Dashboard Layout Wrapper */}
        <Route element={<DashboardLayout />}>

          {/* Shared Resource Routes (accessible by all authenticated roles) */}
          <Route path="/dashboard/:role/resources" element={<ResourceList />} />
          <Route path="/dashboard/:role/resources/:id" element={<ResourceCalendar />} />
          <Route path="/dashboard/:role/resources/:id/special" element={<SpecialBooking />} />

          {/* Shared Booking Routes */}
          <Route path="/dashboard/:role/bookings" element={<MyBookings />} />
          <Route path="/dashboard/:role/faculty-meeting" element={<FacultyMeeting />} />

          {/* Role-based Routes */}
          <Route element={<RequireRole allowedRoles={['STUDENT']} />}>
            <Route path="/dashboard/student" element={<StudentDashboardPage />} />
          </Route>

          <Route element={<RequireRole allowedRoles={['STAFF']} />}>
            <Route path="/dashboard/staff" element={<FacultyDashboardPage />} />
            <Route path="/dashboard/staff/approvals" element={<ApprovalPanel />} />
          </Route>

          <Route element={<RequireRole allowedRoles={['LAB_INCHARGE']} />}>
            <Route path="/dashboard/lab-incharge" element={<LabInChargeDashboardPage />} />
            <Route path="/dashboard/lab-incharge/approvals" element={<ApprovalPanel />} />
            <Route path="/dashboard/lab-incharge/schedule" element={<div>Lab Schedule Placeholder</div>} />
            <Route path="/dashboard/lab-incharge/resources" element={<ResourceManagement />} />
          </Route>

          <Route element={<RequireRole allowedRoles={['ADMIN']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
            <Route path="/dashboard/admin/approvals" element={<ApprovalPanel />} />
            <Route path="/dashboard/admin/bookings" element={<AllBookings />} />
            <Route path="/dashboard/admin/users" element={<UserManagement />} />
            <Route path="/dashboard/admin/resources" element={<ResourceManagement />} />
            <Route path="/dashboard/admin/audit" element={<AuditLogs />} />
          </Route>

          {/* Default Dashboard Redirect */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />

        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

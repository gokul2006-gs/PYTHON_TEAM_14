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
import { ApprovalPanel } from './pages/dashboard/approvals/ApprovalPanel';

// Placeholder dashboards
const StudentDashboard = () => <div>Student Dashboard</div>;
const FacultyDashboard = () => <div>Faculty Dashboard</div>; // We replaced these with actual files but imports might be missing if I overwrite. 
// Wait, I created StudentDashboard.tsx etc in src/pages/dashboard/...
// I should import them properly.

import { StudentDashboard as StudentDashboardPage } from './pages/dashboard/student/StudentDashboard';
import { FacultyDashboard as FacultyDashboardPage } from './pages/dashboard/faculty/FacultyDashboard';
import { LabInChargeDashboard as LabInChargeDashboardPage } from './pages/dashboard/lab-in-charge/LabInChargeDashboard';
import { AdminDashboard as AdminDashboardPage } from './pages/dashboard/admin/AdminDashboard';
import { UserManagement } from './pages/dashboard/admin/UserManagement';
import { AuditLogs } from './pages/dashboard/admin/AuditLogs';

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

          {/* Role-based Routes */}
          <Route element={<RequireRole allowedRoles={['student']} />}>
            <Route path="/dashboard/student" element={<StudentDashboardPage />} />
            {/* Student bookings are handled by shared route, but we can add specific sub-routes if needed later */}
          </Route>

          <Route element={<RequireRole allowedRoles={['faculty']} />}>
            <Route path="/dashboard/faculty" element={<FacultyDashboardPage />} />
            <Route path="/dashboard/faculty/approvals" element={<ApprovalPanel />} />
          </Route>

          <Route element={<RequireRole allowedRoles={['lab_in_charge']} />}>
            <Route path="/dashboard/lab-in-charge" element={<LabInChargeDashboardPage />} />
            <Route path="/dashboard/lab-in-charge/approvals" element={<ApprovalPanel />} />
            <Route path="/dashboard/lab-in-charge/schedule" element={<div>Lab Schedule Placeholder</div>} />
            <Route path="/dashboard/lab-in-charge/resources" element={<div>Manage Resources Placeholder</div>} />
          </Route>

          <Route element={<RequireRole allowedRoles={['admin']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
            <Route path="/dashboard/admin/approvals" element={<ApprovalPanel />} />
            <Route path="/dashboard/admin/bookings" element={<div>All Bookings Admin View</div>} />
            <Route path="/dashboard/admin/users" element={<UserManagement />} />
            <Route path="/dashboard/admin/resources" element={<div>Resource Management Placeholder</div>} />
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

import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, GuestRoute } from './ProtectedRoute';

// Public pages
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register/Register';
import RegisterComplete from '../pages/public/Register/RegisterComplete';

// User pages
import UserLayout from '../layouts/UserLayout';
import Dashboard from '../pages/user/Dashboard';
import Matches from '../pages/user/Matches';
import CandidateProfile from '../pages/user/CandidateProfile';
import Interests from '../pages/user/Interests';
import MyProfile from '../pages/user/MyProfile';
import Compatibility from '../pages/user/Compatibility';

// Admin pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import PendingVerification from '../pages/admin/PendingVerification';
import ProfileReview from '../pages/admin/ProfileReview';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/complete" element={<ProtectedRoute><RegisterComplete /></ProtectedRoute>} />

      {/* User (authenticated) */}
      <Route path="/" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route path="dashboard"   element={<Dashboard />} />
        <Route path="matches"     element={<Matches />} />
        <Route path="matches/:id" element={<CandidateProfile />} />
        <Route path="matches/:id/compatibility" element={<Compatibility />} />
        <Route path="interests"   element={<Interests />} />
        <Route path="profile/me"  element={<MyProfile />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="pending"        element={<PendingVerification />} />
        <Route path="profile/:id"    element={<ProfileReview />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

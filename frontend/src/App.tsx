import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { GuestRoute } from './components/auth/GuestRoute';

// Page Imports
import HackathonFeed from './pages/HackathonFeed';
import HackathonDetail from './pages/HackathonDetail';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import MyProfile from './pages/Profile/MyProfile';
import UserProfile from './pages/Profile/UserProfile';
import CreateHackathon from './pages/Admin/CreateHackathon';
import EditHackathon from './pages/Admin/EditHackathon';
import HackathonParticipants from './pages/HackathonParticipants';

// Main App component with route definitions and layout
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          
          {/* 1. PUBLIC FEED */}
          <Route path="/" element={<HackathonFeed />} />

          {/* 2. GUEST ONLY: Prevents logged-in users from seeing Auth forms */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* 3. PUBLIC DETAIL */}
          <Route path="/hackathons/:id" element={<HackathonDetail />} />

          {/* 4. PROTECTED */}
          <Route element={<ProtectedRoute />}>
            <Route path="/hackathons/:id/participants" element={<HackathonParticipants />} />
            <Route path="/profile/me" element={<MyProfile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
          </Route>

          {/* 5. ADMIN ONLY: requireAdmin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/create" element={<CreateHackathon />} />
            <Route path="/admin/edit/:id" element={<EditHackathon />} />
          </Route>

        </Route>

        {/* 6. 404 CLEAN EXIT: Outside MainLayout to prevent UI flicker */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
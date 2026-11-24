import { Navigate, Route, Routes } from 'react-router-dom';
import { homePathFor, useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UsersPage from './components/UsersPage.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import MySchedule from './pages/MySchedule.jsx';
import ScheduleGrid from './pages/admin/ScheduleGrid.jsx';
import Groups from './pages/admin/Groups.jsx';
import Subjects from './pages/admin/Subjects.jsx';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-center">Yuklanmoqda…</div>;
  return <Navigate to={user ? homePathFor(user.role) : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Bitta Layout (sidebar bilan), sahifalar rolga qarab himoyalangan */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin/schedule" element={<ScheduleGrid />} />
            <Route path="/admin/teachers" element={<UsersPage key="teacher" kind="teacher" />} />
            <Route path="/admin/students" element={<UsersPage key="student" kind="student" />} />
            <Route path="/admin/groups" element={<Groups />} />
            <Route path="/admin/subjects" element={<Subjects />} />
          </Route>

          <Route element={<ProtectedRoute roles={['teacher']} />}>
            <Route path="/teacher/schedule" element={<MySchedule role="teacher" />} />
          </Route>

          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route path="/student/schedule" element={<MySchedule role="student" />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

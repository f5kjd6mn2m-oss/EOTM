import { Navigate, Outlet } from 'react-router-dom';
import { homePathFor, useAuth } from '../context/AuthContext.jsx';

/** roles berilsa — faqat shu rollar kira oladi; aks holda o'z bosh sahifasiga qaytariladi */
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-center">Yuklanmoqda…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homePathFor(user.role)} replace />;
  return <Outlet />;
}

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { MENU, ROLE_LABEL } from '../config/menu.js';

export default function Sidebar({ open, onNavigate }) {
  const { user, logout } = useAuth();
  const items = MENU.filter((m) => m.roles.includes(user.role));

  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <span className="brand-logo">OXU</span>
        <span className="brand-text">Dars jadvali</span>
      </div>

      <nav className="nav">
        {items.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            onClick={onNavigate}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{m.icon}</span>
            {m.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">{user.fullName.charAt(0).toUpperCase()}</div>
        <div className="user-meta">
          <strong>{user.fullName}</strong>
          <small>{ROLE_LABEL[user.role]}</small>
        </div>
        <button className="icon-btn light" onClick={logout} title="Chiqish" aria-label="Chiqish">
          ⏻
        </button>
      </div>
    </aside>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.svg" alt="Logo" />
        <span>POS.VN</span>
      </div>

      <nav className="sidebar-menu">
        <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <i className="sidebar-icon">🏠</i>
          <span>Home</span>
        </Link>

        <Link to="/foods" className={`sidebar-item ${isActive('/foods') ? 'active' : ''}`}>
          <i className="sidebar-icon">☕</i>
          <span>Món ăn</span>
        </Link>

        <Link to="/applications" className={`sidebar-item ${isActive('/applications') ? 'active' : ''}`}>
          <i className="sidebar-icon">📱</i>
          <span>Applications</span>
        </Link>

        <Link to="/roles" className={`sidebar-item ${isActive('/roles') ? 'active' : ''}`}>
          <i className="sidebar-icon">👥</i>
          <span>Roles</span>
        </Link>

        <Link to="/privileges" className={`sidebar-item ${isActive('/privileges') ? 'active' : ''}`}>
          <i className="sidebar-icon">🔑</i>
          <span>Privileges</span>
        </Link>

        <Link to="/users" className={`sidebar-item ${isActive('/users') ? 'active' : ''}`}>
          <i className="sidebar-icon">👤</i>
          <span>Users</span>
        </Link>

        <Link to="/companies" className={`sidebar-item ${isActive('/companies') ? 'active' : ''}`}>
          <i className="sidebar-icon">🏢</i>
          <span>Companies</span>
        </Link>

        <Link to="/reports" className={`sidebar-item ${isActive('/reports') ? 'active' : ''}`}>
          <i className="sidebar-icon">📊</i>
          <span>Report</span>
        </Link>

        <Link to="/settings" className={`sidebar-item ${isActive('/settings') ? 'active' : ''}`}>
          <i className="sidebar-icon">⚙️</i>
          <span>Settings</span>
        </Link>

        <div className="sidebar-item" onClick={handleLogout}>
          <i className="sidebar-icon">🚪</i>
          <span>Sign Out</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 
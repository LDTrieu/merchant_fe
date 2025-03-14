import { useState } from 'react';
import { getCookie, decodeToken } from '../../utils/authUtils';
import './Layout.css';

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Lấy thông tin người dùng từ token
  const getUserInfo = () => {
    const token = getCookie('token');
    if (token) {
      const decoded = decodeToken(token);
      return decoded || {};
    }
    return {};
  };

  const userInfo = getUserInfo();
  const username = userInfo.username || 'User';

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Nút menu đã được loại bỏ */}
      </div>
      
      <div className="header-right">
        <div className="header-notifications">
          <button className="notification-button">
            <span>🔔</span>
            <span className="notification-badge">2</span>
          </button>
        </div>
        
        <div className="user-profile">
          <div className="user-avatar" onClick={toggleUserMenu}>
            <span>👤</span>
          </div>
          <div className="user-info" onClick={toggleUserMenu}>
            <span>{username}</span>
            <span className="dropdown-arrow">▼</span>
          </div>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-item">
                <span>👤</span>
                <span>Profile</span>
              </div>
              <div className="dropdown-item">
                <span>⚙️</span>
                <span>Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item">
                <span>🚪</span>
                <span>Sign Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 
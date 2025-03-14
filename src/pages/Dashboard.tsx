import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, checkAuth } from '../services/authService';
import { getCookie, decodeToken } from '../utils/authUtils';
import Layout from '../components/layout/Layout';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!checkAuth()) {
      navigate('/login');
    }
  }, [navigate]);

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

  const handleLogout = () => {
    // Xóa token và chuyển hướng về trang đăng nhập
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h1>Dashboard</h1>
        <p>Chào mừng {userInfo.username || 'bạn'} đến với trang quản trị!</p>
        
        <div style={{ marginTop: '20px' }}>
          <h2>Quản lý hệ thống</h2>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <Link 
              to="/users" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#e8f5e9',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#0c8043',
                width: '150px'
              }}
            >
              <span style={{ fontSize: '32px', marginBottom: '10px' }}>👥</span>
              <span>Quản lý người dùng</span>
            </Link>
            
            <Link 
              to="/foods" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#1976d2',
                width: '150px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '32px', marginBottom: '10px' }}>🍔</span>
              <span>Quản lý món ăn</span>
            </Link>
            
            <Link 
              to="/orders/create" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#fff3e0',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#e65100',
                width: '150px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '32px', marginBottom: '10px' }}>📋</span>
              <span>Đặt món</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 
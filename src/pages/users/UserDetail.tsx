import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import PermissionTab from '../../components/users/PermissionTab';
import { User } from '../../models/User';
import { getUsers } from '../../services/userService';
import './UserDetail.css';

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('detail');

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Trong thực tế, chúng ta sẽ gọi API để lấy chi tiết người dùng theo ID
        // Ở đây, chúng ta sẽ sử dụng API getUsers và lọc theo ID
        const response = await getUsers();
        
        if (response.success && response.data) {
          const foundUser = response.data.find(u => u.userId === userId);
          if (foundUser) {
            setUser(foundUser);
          } else {
            setError('Không tìm thấy người dùng');
          }
        } else {
          setError(response.message || 'Không thể tải thông tin người dùng');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải thông tin người dùng');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'detail':
        return renderDetailTab();
      case 'apps':
        return <div className="tab-content">Thông tin ứng dụng sẽ được hiển thị ở đây</div>;
      case 'roles':
        return <div className="tab-content">Thông tin vai trò sẽ được hiển thị ở đây</div>;
      case 'skills':
        return <div className="tab-content">Thông tin kỹ năng sẽ được hiển thị ở đây</div>;
      case 'locations':
        return <div className="tab-content">Thông tin địa điểm sẽ được hiển thị ở đây</div>;
      case 'object':
        return <div className="tab-content">Thông tin đối tượng/thuộc tính sẽ được hiển thị ở đây</div>;
      case 'permission':
        return userId ? <PermissionTab userId={userId} /> : null;
      default:
        return renderDetailTab();
    }
  };

  const renderDetailTab = () => {
    if (!user) return null;

    return (
      <div className="user-detail-info">
        <div className="info-row">
          <div className="info-label">Name:</div>
          <div className="info-value">{user.userName}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Email:</div>
          <div className="info-value">{user.email}</div>
        </div>
        {user.code && (
          <div className="info-row">
            <div className="info-label">Code:</div>
            <div className="info-value">{user.code}</div>
          </div>
        )}
        {user.phone && (
          <div className="info-row">
            <div className="info-label">Phone Number:</div>
            <div className="info-value">{user.phone}</div>
          </div>
        )}
        {user.department && (
          <div className="info-row">
            <div className="info-label">Department:</div>
            <div className="info-value">{user.department}</div>
          </div>
        )}
        {user.position && (
          <div className="info-row">
            <div className="info-label">Position:</div>
            <div className="info-value">{user.position}</div>
          </div>
        )}
        {user.major && (
          <div className="info-row">
            <div className="info-label">Major:</div>
            <div className="info-value">{user.major}</div>
          </div>
        )}
        {user.workLocation && (
          <div className="info-row">
            <div className="info-label">Work Location:</div>
            <div className="info-value">{user.workLocation}</div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Đang tải...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-message">{error}</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="error-message">Không tìm thấy thông tin người dùng</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="user-detail-container">
        <div className="user-detail-header">
          <div className="breadcrumb">
            <Link to="/users">Users</Link>
            <span className="breadcrumb-separator">›</span>
            <span>{user.userName} (ID: {user.userId})</span>
          </div>
        </div>

        <div className="user-detail-content">
          <div className="user-detail-sidebar">
            <div className="user-avatar">
              <div className="avatar-placeholder">
                <span>👤</span>
              </div>
            </div>
          </div>

          <div className="user-detail-main">
            <div className="user-detail-tabs">
              <button 
                className={`tab-button ${activeTab === 'detail' ? 'active' : ''}`}
                onClick={() => handleTabChange('detail')}
              >
                Detail
              </button>
              <button 
                className={`tab-button ${activeTab === 'apps' ? 'active' : ''}`}
                onClick={() => handleTabChange('apps')}
              >
                Apps
              </button>
              <button 
                className={`tab-button ${activeTab === 'roles' ? 'active' : ''}`}
                onClick={() => handleTabChange('roles')}
              >
                Roles
              </button>
              <button 
                className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => handleTabChange('skills')}
              >
                Skills
              </button>
              <button 
                className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
                onClick={() => handleTabChange('locations')}
              >
                Locations
              </button>
              <button 
                className={`tab-button ${activeTab === 'object' ? 'active' : ''}`}
                onClick={() => handleTabChange('object')}
              >
                Object/Attribute
              </button>
              <button 
                className={`tab-button ${activeTab === 'permission' ? 'active' : ''}`}
                onClick={() => handleTabChange('permission')}
              >
                Permission
              </button>
            </div>

            <div className="user-detail-tab-content">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDetail; 
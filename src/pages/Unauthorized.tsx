import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import '../styles/Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="unauthorized-container">
        <div className="unauthorized-content">
          <h1>Không có quyền truy cập</h1>
          <p>Bạn không có quyền truy cập vào trang này.</p>
          <p>Vui lòng liên hệ với quản trị viên để được cấp quyền.</p>
          
          <div className="unauthorized-actions">
            <button 
              className="back-button" 
              onClick={handleGoBack}
            >
              Quay lại
            </button>
            <button 
              className="dashboard-button" 
              onClick={handleGoToDashboard}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized; 
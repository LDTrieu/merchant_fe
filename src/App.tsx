import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/users/UserManagement';
import UserDetail from './pages/users/UserDetail';
import FoodManagement from './pages/foods/FoodManagement';
import FoodDetail from './pages/foods/FoodDetail';
import OrderManagement from './pages/orders/OrderManagement';
import OrderCreate from './pages/orders/OrderCreate';
import Unauthorized from './pages/Unauthorized';
import { isAuthenticated } from './utils/authUtils';
import { getMe } from './services/authService';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Component chuyển hướng nếu đã đăng nhập
interface RedirectIfAuthenticatedProps {
  children: ReactNode;
}

const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const isAuth = isAuthenticated();

  if (isAuth) {
    // Chuyển hướng đến trang dashboard nếu đã đăng nhập
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  // Kiểm tra token và lấy thông tin người dùng khi ứng dụng khởi động
  useEffect(() => {
    const checkAuthAndGetUserInfo = async () => {
      const isAuth = isAuthenticated();
      console.log('Authentication status:', isAuth ? 'Logged in' : 'Not logged in');
      
      if (isAuth) {
        try {
          // Gọi API GetMe để lấy thông tin người dùng và quyền
          const response = await getMe();
          if (response.success) {
            console.log('User info loaded successfully');
          } else {
            console.error('Failed to load user info:', response.message);
          }
        } catch (error) {
          console.error('Error loading user info:', error);
        }
      }
    };

    checkAuthAndGetUserInfo();
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute requiredPermissions={["auth-user-list"]}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/:userId" 
          element={
            <ProtectedRoute requiredPermissions={["auth-user-list", "auth-user-permission-list"]}>
              <UserDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/foods" 
          element={
            <ProtectedRoute requiredPermissions={["auth-food-list"]}>
              <FoodManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/foods/:id" 
          element={
            <ProtectedRoute requiredPermissions={["auth-food-list"]}>
              <FoodDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute requiredPermissions={["auth-order-list"]}>
              <OrderManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders/create" 
          element={
            <ProtectedRoute requiredPermissions={["auth-order-create"]}>
              <OrderCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/unauthorized" 
          element={
            <ProtectedRoute>
              <Unauthorized />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

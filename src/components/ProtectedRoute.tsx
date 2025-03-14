import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasPermission, hasAnyPermission } from '../utils/authUtils';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requireAnyPermission?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requireAnyPermission = false 
}: ProtectedRouteProps) => {
  const isAuth = isAuthenticated();
  const location = useLocation();

  if (!isAuth) {
    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu không yêu cầu quyền cụ thể, cho phép truy cập
  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  // Kiểm tra quyền truy cập
  const hasAccess = requireAnyPermission 
    ? hasAnyPermission(requiredPermissions)
    : requiredPermissions.every(permission => hasPermission(permission));

  if (!hasAccess) {
    // Chuyển hướng đến trang không có quyền truy cập
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
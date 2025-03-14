import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  isAuthenticated,
  hasPermission,
  hasAnyPermission,
} from "../utils/authUtils";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requireAnyPermission?: boolean;
}

const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  requireAnyPermission = false,
}: ProtectedRouteProps) => {
  const isAuth = isAuthenticated();
  const location = useLocation();

  console.log("ProtectedRoute - Path:", location.pathname);
  console.log("ProtectedRoute - Trạng thái xác thực:", isAuth);
  console.log("ProtectedRoute - Quyền yêu cầu:", requiredPermissions);

  if (!isAuth) {
    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    console.log("Chưa đăng nhập, chuyển hướng đến /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu không yêu cầu quyền cụ thể, cho phép truy cập
  if (requiredPermissions.length === 0) {
    console.log("Không yêu cầu quyền cụ thể, cho phép truy cập");
    return <>{children}</>;
  }

  // Kiểm tra quyền truy cập
  const hasAccess = requireAnyPermission
    ? hasAnyPermission(requiredPermissions)
    : requiredPermissions.every((permission) => hasPermission(permission));

  console.log("Kết quả kiểm tra quyền:", hasAccess);

  if (!hasAccess) {
    // Chuyển hướng đến trang không có quyền truy cập
    console.log("Không có quyền truy cập, chuyển hướng đến /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

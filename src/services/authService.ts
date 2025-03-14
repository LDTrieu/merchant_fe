import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/apiUrls';
import { setCookie, getCookie, createMockJWT, generateMockToken, saveAuthData, clearAuthData, getToken } from '../utils/authUtils';
import { getUserPermissions } from './permissionService';
import { LOGIN_URL } from '../constants/url_constants';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: any;
  permissions?: string[];
}

interface UserData {
  user_id: number;
  last_name: string;
  email: string;
  status: string;
  staff_code: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    // Trong thực tế, đây sẽ là API call
    // const response = await fetch(LOGIN_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ username, password })
    // });
    // const data = await response.json();
    
    // Mock: Kiểm tra thông tin đăng nhập
    if ((username === 'user1' || username === 'user1@pos.vn') && password === '123456') {
      // Tạo token giả
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIwMjQ5NzgsInN1YiI6MTE4NywiRW1haWwiOiJzaG9wNTU1QGhhc2FraS52biJ9.FFh9l7aSOnbm2pMaKZ4hZrT8nwWKLHzl6JVj0f8neb0";
      
      // Tạo dữ liệu người dùng
      const userData: UserData = {
        user_id: 1187,
        last_name: "User1",
        email: "user1@pos.vn",
        status: "ACTIVE",
        staff_code: "19198"
      };
      
      // Tạo danh sách quyền cho user1
      const permissions = [
        // Quyền quản lý người dùng cơ bản
        "auth-user-list",
        "auth-user-detail-list",
        // Quyền quản lý món ăn
        "auth-food-list",
        // Quyền quản lý đơn hàng
        "auth-order-list",
        "auth-order-create"
      ];
      
      // Lưu token và quyền
      saveAuthData(token, permissions, userData);
      
      return {
        success: true,
        token,
        user: userData,
        permissions
      };
    } else if (username === 'admin' && password === 'admin123') {
      // Tạo token giả cho admin
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIwMjQ5NzgsInN1YiI6MTE4NywiRW1haWwiOiJhZG1pbkBoYXNha2kudm4ifQ.FFh9l7aSOnbm2pMaKZ4hZrT8nwWKLHzl6JVj0f8neb0";
      
      // Tạo dữ liệu người dùng
      const userData: UserData = {
        user_id: 1001,
        last_name: "Admin",
        email: "admin@pos.vn",
        status: "ACTIVE",
        staff_code: "10001"
      };
      
      // Tạo danh sách quyền đầy đủ cho admin
      const permissions = [
        "auth-user-list",
        "auth-user-create",
        "auth-user-update",
        "auth-user-delete",
        "auth-user-export",
        "auth-user-permission-list",
        "auth-user-permission-create",
        "auth-user-permission-update",
        "auth-user-permission-delete",
        "auth-user-permission-export",
        "auth-role-list",
        "auth-role-create",
        "auth-role-update",
        "auth-role-delete",
        "auth-role-privilege-list",
        "auth-role-privilege-create",
        "auth-role-privilege-update",
        "auth-role-privilege-delete",
        "auth-privilege-list",
        "auth-privilege-create",
        "auth-privilege-update",
        "auth-privilege-delete",
        "auth-privilege-export",
        "auth-privilege-user-list",
        "auth-privilege-user-create",
        "auth-privilege-user-update",
        "auth-privilege-user-delete",
        "auth-privilege-role-list",
        "auth-privilege-role-create",
        "auth-privilege-role-update",
        "auth-privilege-role-delete",
        "auth-application-list",
        "auth-application-create",
        "auth-application-update",
        "auth-application-delete",
        "auth-application-menu-list",
        "auth-application-menu-create",
        "auth-application-menu-update",
        "auth-application-menu-delete",
        "auth-application-menu-export",
        "auth-application-menu-import",
        "auth-application-menus-list",
        "auth-application-menus-create",
        "auth-application-menus-update",
        "auth-application-menus-delete",
        "auth-application-menus-export",
        "auth-application-menus-import",
        "auth-application-object-list",
        "auth-application-privilege-list",
        "auth-application-json-preview-list",
        "auth-company-list",
        "auth-companies-list",
        "auth-companies-detail-list",
        "auth-company-role-list",
        "auth-company-privilege-list",
        "auth-company-object-list",
        "auth-company-skill-list",
        "auth-company-location-list",
        "auth-dashboard-list",
        "auth-report-index",
        "auth-report-list",
        "auth-report-user-list",
        "auth-report-user-persional-key-list",
        "auth-report-user-persional-key-export",
        "auth-report-action-log-list",
        "auth-report-action-log-create",
        "auth-report-action-log-update",
        "auth-setting-list",
        "auth-setting-index",
        "auth-user-search",
        "auth-user-detail-list",
        "auth-user-app-list",
        "auth-user-skill-list",
        "auth-user-object-list",
        "auth-user-role-list",
        "auth-user-role-create",
        "auth-user-role-update",
        "auth-user-role-delete",
        "auth-user-location-list",
        "auth-user-location-create",
        "auth-user-location-update",
        "auth-user-location-delete",
        "auth-user-privilege-list",
        "auth-user-privilege-create",
        "auth-user-privilege-update",
        "auth-user-privilege-delete",
        "auth-user-edit",
        "auth-user-export",
        "auth-role-edit",
        "auth-role-user-list",
        "auth-role-user-create",
        "auth-role-user-update",
        "auth-role-user-delete",
        "auth-role-permission-list",
        "auth-role-permission-create",
        "auth-role-permission-update",
        "auth-role-permission-delete",
        "auth-privilege-edit",
        // Quyền quản lý món ăn
        "auth-food-list",
        "auth-food-create",
        "auth-food-update",
        "auth-food-delete",
        "auth-food-export",
        // Quyền quản lý đơn hàng
        "auth-order-list",
        "auth-order-create",
        "auth-order-update",
        "auth-order-delete",
        "auth-order-export"
      ];
      
      // Lưu token và quyền
      saveAuthData(token, permissions, userData);
      
      return {
        success: true,
        token,
        user: userData,
        permissions
      };
    }
    
    return {
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không đúng'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi đăng nhập'
    };
  }
};

export const logout = (): void => {
  // Xóa token và quyền
  clearAuthData();
};

export const checkAuth = (): boolean => {
  const token = getToken();
  return !!token;
};

export const getMe = async (): Promise<LoginResponse> => {
  try {
    // Trong thực tế, đây sẽ là API call
    // const token = getToken();
    // if (!token) {
    //   return {
    //     success: false,
    //     message: 'Không tìm thấy token'
    //   };
    // }
    
    // const response = await fetch('/api/me', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    // const data = await response.json();
    
    // Mock: Trả về thông tin người dùng
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: 'Không tìm thấy token'
      };
    }
    
    // Giả lập dữ liệu trả về từ API
    const userData: UserData = {
      user_id: 1187,
      last_name: "User1",
      email: "user1@pos.vn",
      status: "ACTIVE",
      staff_code: "19198"
    };
    
    // Tạo danh sách quyền cho user1
    const permissions = [
      // Quyền quản lý người dùng cơ bản
      "auth-user-list",
      "auth-user-detail-list",
      // Quyền quản lý món ăn
      "auth-food-list",
      // Quyền quản lý đơn hàng
      "auth-order-list",
      "auth-order-create"
    ];
    
    return {
      success: true,
      token,
      user: userData,
      permissions
    };
  } catch (error) {
    console.error('GetMe error:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin người dùng'
    };
  }
}; 
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiUrls";
import {
  setCookie,
  getCookie,
  saveAuthData,
  clearAuthData,
  getToken,
} from "../utils/authUtils";
import { getUserPermissions } from "./permissionService";
import { LOGIN_URL } from "../constants/url_constants";

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

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    console.log("Đang gọi API đăng nhập với:", username);
    // Gọi API đăng nhập
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      email: username,
      password: password,
    });

    console.log("Kết quả API đăng nhập:", response.status, response.data);

    // Kiểm tra response
    if (response.status === 200 && response.data) {
      const data = response.data;

      // Lấy thông tin từ response
      const token = data.token;
      const userData = data.user;
      const permissions = data.permissions || [];

      console.log("Đăng nhập thành công, token:", token ? "Có" : "Không");
      console.log("Thông tin người dùng:", userData);
      console.log("Quyền:", permissions);

      // Lưu token và quyền
      saveAuthData(token, permissions, userData);

      return {
        success: true,
        token,
        user: userData,
        permissions,
      };
    }

    return {
      success: false,
      message: "Tên đăng nhập hoặc mật khẩu không đúng",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi đăng nhập",
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
    // Lấy token từ storage
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: "Không tìm thấy token",
      };
    }

    // Gọi API GetMe
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_ME}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Kiểm tra response
    if (response.status === 200 && response.data) {
      const data = response.data;

      // Lấy thông tin từ response
      const userData = data.user;
      const permissions = data.permissions || [];

      // Cập nhật thông tin người dùng và quyền
      saveAuthData(token, permissions, userData);

      return {
        success: true,
        user: userData,
        permissions,
      };
    }

    return {
      success: false,
      message: "Không thể lấy thông tin người dùng",
    };
  } catch (error) {
    console.error("GetMe error:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi lấy thông tin người dùng",
    };
  }
};

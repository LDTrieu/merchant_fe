// import { jwtDecode } from 'jwt-decode';
import { PermissionCode } from "../models/Permission";

// Lấy cookie theo tên
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Đặt cookie
export const setCookie = (
  name: string,
  value: string,
  days: number = 7
): void => {
  console.log(
    `setCookie - Đặt cookie ${name} với giá trị ${value.substring(
      0,
      20
    )}... và thời hạn ${days} ngày`
  );
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
  console.log(`setCookie - Cookie sau khi đặt: ${document.cookie}`);
};

// Xóa cookie
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Giải mã token JWT (hàm tự viết thay thế jwt-decode)
export const decodeToken = (token: string): any => {
  try {
    // Tách phần payload từ token (phần thứ 2 sau dấu chấm)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Giải mã base64 thành chuỗi JSON
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    // Parse chuỗi JSON thành object
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Kiểm tra token có hợp lệ không
export const isTokenValid = (token: string): boolean => {
  try {
    console.log(
      "isTokenValid - Kiểm tra token:",
      token.substring(0, 20) + "..."
    );
    const decoded = decodeToken(token);
    console.log("isTokenValid - Token đã giải mã:", decoded);
    if (!decoded) {
      console.log("isTokenValid - Token không thể giải mã");
      return false;
    }

    // Tạm thời bỏ qua kiểm tra thời gian hết hạn
    console.log("isTokenValid - Bỏ qua kiểm tra thời gian hết hạn");
    // const currentTime = Date.now() / 1000;
    // console.log("isTokenValid - Thời gian hiện tại:", currentTime);
    // console.log("isTokenValid - Thời gian hết hạn:", decoded.exp);
    // const isValid = decoded.exp > currentTime;
    const isValid = true; // Luôn trả về true nếu token có thể giải mã
    console.log("isTokenValid - Token có hợp lệ:", isValid);
    return isValid;
  } catch (error) {
    console.error("isTokenValid - Lỗi khi kiểm tra token:", error);
    return false;
  }
};

// Kiểm tra người dùng đã đăng nhập chưa
export const isAuthenticated = (): boolean => {
  console.log("isAuthenticated - Bắt đầu kiểm tra xác thực");
  const token = getToken();
  console.log(
    "isAuthenticated - Token:",
    token ? "Có token" : "Không có token"
  );
  if (!token) return false;

  const isValid = isTokenValid(token);
  console.log("isAuthenticated - Kết quả kiểm tra:", isValid);
  return isValid;
};

// Hàm để tạo một JWT token giả (mock)
export const createMockJWT = (payload: any): string => {
  // Header: { "alg": "HS256", "typ": "JWT" }
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));

  // Payload
  const encodedPayload = btoa(JSON.stringify(payload));

  // Signature (mock)
  const signature = btoa("mock-signature");

  return `${header}.${encodedPayload}.${signature}`;
};

// Tạo token giả cho mock
export const generateMockToken = (userData: any): string => {
  // Tạo token với thời gian hết hạn dài hơn (1 năm)
  const currentTime = Math.floor(Date.now() / 1000);
  const oneYearInSeconds = 365 * 24 * 60 * 60;
  const expTime = currentTime + oneYearInSeconds;

  const payload = {
    ...userData,
    exp: expTime, // Hết hạn sau 1 năm
  };

  console.log(
    "generateMockToken - Tạo token với thời gian hết hạn:",
    new Date(expTime * 1000).toISOString()
  );
  return createMockJWT(payload);
};

// Lưu thông tin đăng nhập vào auth_store
export const saveAuthData = (
  token: string,
  permissions: string[] = [],
  userData: any = null
): void => {
  console.log("saveAuthData - Bắt đầu lưu thông tin đăng nhập");
  console.log(
    "saveAuthData - Token:",
    token ? token.substring(0, 20) + "..." : "Không có"
  );
  console.log("saveAuthData - Permissions:", permissions);
  console.log("saveAuthData - UserData:", userData);

  // Lưu token vào cookie
  setCookie("token", token);

  // Lưu permissions vào localStorage
  localStorage.setItem("permissions", JSON.stringify(permissions));
  console.log("saveAuthData - Đã lưu permissions vào localStorage");

  // Lưu auth_store vào localStorage
  const authStore = {
    state: {
      token: token,
      user: userData,
    },
    version: 0,
  };
  localStorage.setItem("auth_store", JSON.stringify(authStore));
  console.log("saveAuthData - Đã lưu auth_store vào localStorage");

  // Kiểm tra lại xem đã lưu thành công chưa
  const savedToken = getToken();
  console.log(
    "saveAuthData - Kiểm tra token đã lưu:",
    savedToken ? "Có" : "Không"
  );
};

// Xóa thông tin đăng nhập
export const clearAuthData = (): void => {
  deleteCookie("token");
  localStorage.removeItem("permissions");
  localStorage.removeItem("auth_store");
};

// Lấy token từ auth_store hoặc cookie
export const getToken = (): string | null => {
  console.log("getToken - Bắt đầu lấy token");
  // Thử lấy từ auth_store trước
  const authStoreStr = localStorage.getItem("auth_store");
  console.log(
    "getToken - auth_store từ localStorage:",
    authStoreStr ? "Có" : "Không"
  );
  if (authStoreStr) {
    try {
      const authStore = JSON.parse(authStoreStr);
      console.log("getToken - authStore đã parse:", authStore);
      if (authStore.state && authStore.state.token) {
        console.log("getToken - Đã tìm thấy token trong auth_store");
        return authStore.state.token;
      }
    } catch (error) {
      console.error("Error parsing auth_store:", error);
    }
  }

  // Nếu không có trong auth_store, lấy từ cookie
  const cookieToken = getCookie("token");
  console.log("getToken - Token từ cookie:", cookieToken ? "Có" : "Không");
  return cookieToken;
};

// Lấy thông tin người dùng từ auth_store
export const getUserData = (): any => {
  const authStoreStr = localStorage.getItem("auth_store");
  if (authStoreStr) {
    try {
      const authStore = JSON.parse(authStoreStr);
      if (authStore.state && authStore.state.user) {
        return authStore.state.user;
      }
    } catch (error) {
      console.error("Error parsing auth_store:", error);
    }
  }

  return null;
};

// Lấy danh sách quyền của người dùng
export const getUserPermissions = (): string[] => {
  const permissionsStr = localStorage.getItem("permissions");
  if (!permissionsStr) return [];

  try {
    return JSON.parse(permissionsStr);
  } catch (error) {
    console.error("Error parsing permissions:", error);
    return [];
  }
};

// Kiểm tra người dùng có quyền không
export const hasPermission = (permissionCode: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permissionCode);
};

// Kiểm tra người dùng có ít nhất một trong các quyền không
export const hasAnyPermission = (permissionCodes: string[]): boolean => {
  const permissions = getUserPermissions();
  return permissionCodes.some((code) => permissions.includes(code));
};

// Base URL
export const API_BASE_URL = 'https://api.pos.vn';

// Auth
export const LOGIN_URL = `${API_BASE_URL}/auth/login`;
export const LOGOUT_URL = `${API_BASE_URL}/auth/logout`;
export const REFRESH_TOKEN_URL = `${API_BASE_URL}/auth/refresh-token`;

// User
export const USERS_URL = `${API_BASE_URL}/users`;
export const USER_DETAIL_URL = (userId: string) => `${API_BASE_URL}/users/${userId}`;

// Permission
export const PERMISSIONS_URL = `${API_BASE_URL}/permissions`;
export const USER_PERMISSIONS_URL = (userId: string) => `${API_BASE_URL}/users/${userId}/permissions`;
export const UPDATE_USER_PERMISSIONS_URL = (userId: string) => `${API_BASE_URL}/users/${userId}/permissions`;

// Menu
export const MENU_URL = `${API_BASE_URL}/menu`;

// Order
export const ORDERS_URL = `${API_BASE_URL}/orders`;

// Report
export const DAILY_REPORT_URL = `${API_BASE_URL}/reports/daily`;
export const MONTHLY_REPORT_URL = `${API_BASE_URL}/reports/monthly`; 
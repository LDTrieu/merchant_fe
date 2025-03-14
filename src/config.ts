// API URL cho môi trường phát triển
export const API_URL = 'http://localhost:8080/api';

// Thời gian hết hạn token (ms)
export const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 giờ

// Các cấu hình khác
export const APP_CONFIG = {
  appName: 'Coffee Shop Management',
  version: '1.0.0',
  pageSize: 10,
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
  currency: 'VND',
  taxRate: 1.5, // 1.5%
};

// Cấu hình cho PDF
export const PDF_CONFIG = {
  shopName: 'COFFEE SHOP',
  address: '123 Đường ABC, Quận XYZ, TP.HCM',
  phone: '0123 456 789',
  email: 'info@coffeeshop.com',
  website: 'www.coffeeshop.com',
}; 
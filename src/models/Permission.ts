export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  appCode: string;
  module: string;
}

export interface PermissionGroup {
  appName: string;
  appCode: string;
  permissions: Permission[];
}

export interface UserPermission {
  userId: string;
  permissions: string[]; // Mảng chứa các mã quyền (permission code)
}

export enum PermissionCode {
  // AUTH
  VIEW_USER = 'user.view',
  CREATE_USER = 'user.create',
  UPDATE_USER = 'user.update',
  DELETE_USER = 'user.delete',
  EXPORT_USER = 'user.export',
  
  // MENU
  VIEW_MENU = 'menu.view',
  CREATE_MENU = 'menu.create',
  UPDATE_MENU = 'menu.update',
  DELETE_MENU = 'menu.delete',
  
  // ORDER
  VIEW_ORDER = 'order.view',
  CREATE_ORDER = 'order.create',
  UPDATE_ORDER = 'order.update',
  DELETE_ORDER = 'order.delete',
  APPROVE_ORDER = 'order.approve',
  
  // REPORT
  VIEW_DAILY_REPORT = 'report.daily.view',
  VIEW_MONTHLY_REPORT = 'report.monthly.view',
  EXPORT_REPORT = 'report.export',
  
  // PERMISSION
  MANAGE_PERMISSION = 'permission.manage'
} 
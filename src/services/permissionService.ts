import { Permission, PermissionGroup, UserPermission, PermissionCode } from '../models/Permission';
import { USER_PERMISSIONS_URL, PERMISSIONS_URL, UPDATE_USER_PERMISSIONS_URL } from '../constants/url_constants';

// Mock data cho danh sách quyền
const mockPermissions: Permission[] = [
  // AUTH App
  {
    id: '1',
    name: 'Xem người dùng',
    code: PermissionCode.VIEW_USER,
    description: 'Quyền xem danh sách và thông tin người dùng',
    appCode: 'AUTH',
    module: 'user'
  },
  {
    id: '2',
    name: 'Tạo người dùng',
    code: PermissionCode.CREATE_USER,
    description: 'Quyền tạo người dùng mới',
    appCode: 'AUTH',
    module: 'user'
  },
  {
    id: '3',
    name: 'Cập nhật người dùng',
    code: PermissionCode.UPDATE_USER,
    description: 'Quyền cập nhật thông tin người dùng',
    appCode: 'AUTH',
    module: 'user'
  },
  {
    id: '4',
    name: 'Xóa người dùng',
    code: PermissionCode.DELETE_USER,
    description: 'Quyền xóa người dùng',
    appCode: 'AUTH',
    module: 'user'
  },
  {
    id: '5',
    name: 'Xuất danh sách người dùng',
    code: PermissionCode.EXPORT_USER,
    description: 'Quyền xuất danh sách người dùng',
    appCode: 'AUTH',
    module: 'user'
  },
  
  // MENU App
  {
    id: '6',
    name: 'Xem menu',
    code: PermissionCode.VIEW_MENU,
    description: 'Quyền xem danh sách món ăn',
    appCode: 'MENU',
    module: 'menu'
  },
  {
    id: '7',
    name: 'Tạo món ăn',
    code: PermissionCode.CREATE_MENU,
    description: 'Quyền tạo món ăn mới',
    appCode: 'MENU',
    module: 'menu'
  },
  {
    id: '8',
    name: 'Cập nhật món ăn',
    code: PermissionCode.UPDATE_MENU,
    description: 'Quyền cập nhật thông tin món ăn',
    appCode: 'MENU',
    module: 'menu'
  },
  {
    id: '9',
    name: 'Xóa món ăn',
    code: PermissionCode.DELETE_MENU,
    description: 'Quyền xóa món ăn',
    appCode: 'MENU',
    module: 'menu'
  },
  
  // ORDER App
  {
    id: '10',
    name: 'Xem đơn hàng',
    code: PermissionCode.VIEW_ORDER,
    description: 'Quyền xem danh sách đơn hàng',
    appCode: 'ORDER',
    module: 'order'
  },
  {
    id: '11',
    name: 'Tạo đơn hàng',
    code: PermissionCode.CREATE_ORDER,
    description: 'Quyền tạo đơn hàng mới',
    appCode: 'ORDER',
    module: 'order'
  },
  {
    id: '12',
    name: 'Cập nhật đơn hàng',
    code: PermissionCode.UPDATE_ORDER,
    description: 'Quyền cập nhật thông tin đơn hàng',
    appCode: 'ORDER',
    module: 'order'
  },
  {
    id: '13',
    name: 'Xóa đơn hàng',
    code: PermissionCode.DELETE_ORDER,
    description: 'Quyền xóa đơn hàng',
    appCode: 'ORDER',
    module: 'order'
  },
  {
    id: '14',
    name: 'Phê duyệt đơn hàng',
    code: PermissionCode.APPROVE_ORDER,
    description: 'Quyền phê duyệt đơn hàng',
    appCode: 'ORDER',
    module: 'order'
  },
  
  // REPORT App
  {
    id: '15',
    name: 'Xem báo cáo hằng ngày',
    code: PermissionCode.VIEW_DAILY_REPORT,
    description: 'Quyền xem báo cáo hằng ngày',
    appCode: 'REPORT',
    module: 'report'
  },
  {
    id: '16',
    name: 'Xem báo cáo hằng tháng',
    code: PermissionCode.VIEW_MONTHLY_REPORT,
    description: 'Quyền xem báo cáo hằng tháng',
    appCode: 'REPORT',
    module: 'report'
  },
  {
    id: '17',
    name: 'Xuất báo cáo',
    code: PermissionCode.EXPORT_REPORT,
    description: 'Quyền xuất báo cáo',
    appCode: 'REPORT',
    module: 'report'
  },
  
  // PERMISSION
  {
    id: '18',
    name: 'Quản lý quyền',
    code: PermissionCode.MANAGE_PERMISSION,
    description: 'Quyền quản lý phân quyền cho người dùng',
    appCode: 'AUTH',
    module: 'permission'
  }
];

// Mock data cho quyền của người dùng
const mockUserPermissions: UserPermission[] = [
  {
    userId: 'user1',
    permissions: [
      PermissionCode.VIEW_USER,
      PermissionCode.CREATE_USER,
      PermissionCode.UPDATE_USER,
      PermissionCode.DELETE_USER,
      PermissionCode.EXPORT_USER,
      PermissionCode.VIEW_MENU,
      PermissionCode.VIEW_ORDER,
      PermissionCode.CREATE_ORDER,
      PermissionCode.VIEW_DAILY_REPORT,
      PermissionCode.MANAGE_PERMISSION,
      "auth-food-list",
      "auth-food-create",
      "auth-food-update",
      "auth-food-delete",
      "auth-food-export"
    ]
  },
  {
    userId: '11378',
    permissions: [
      PermissionCode.VIEW_USER,
      PermissionCode.CREATE_USER,
      PermissionCode.UPDATE_USER,
      PermissionCode.DELETE_USER,
      PermissionCode.EXPORT_USER,
      PermissionCode.VIEW_MENU,
      PermissionCode.CREATE_MENU,
      PermissionCode.UPDATE_MENU,
      PermissionCode.DELETE_MENU,
      PermissionCode.VIEW_ORDER,
      PermissionCode.CREATE_ORDER,
      PermissionCode.UPDATE_ORDER,
      PermissionCode.DELETE_ORDER,
      PermissionCode.APPROVE_ORDER,
      PermissionCode.VIEW_DAILY_REPORT,
      PermissionCode.VIEW_MONTHLY_REPORT,
      PermissionCode.EXPORT_REPORT,
      PermissionCode.MANAGE_PERMISSION
    ]
  }
];

// Hàm lấy tất cả quyền
export const getAllPermissions = async (): Promise<{ success: boolean; data?: PermissionGroup[]; message?: string }> => {
  try {
    // Trong thực tế, đây sẽ là API call
    // const response = await fetch(PERMISSIONS_URL);
    // const data = await response.json();
    
    // Mock: Nhóm quyền theo ứng dụng
    const groupedPermissions: { [key: string]: PermissionGroup } = {};
    
    mockPermissions.forEach(permission => {
      if (!groupedPermissions[permission.appCode]) {
        groupedPermissions[permission.appCode] = {
          appName: permission.appCode,
          appCode: permission.appCode,
          permissions: []
        };
      }
      
      groupedPermissions[permission.appCode].permissions.push(permission);
    });
    
    return {
      success: true,
      data: Object.values(groupedPermissions)
    };
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return {
      success: false,
      message: 'Không thể lấy danh sách quyền'
    };
  }
};

// Hàm lấy quyền của người dùng
export const getUserPermissions = async (userId: string): Promise<{ success: boolean; data?: string[]; message?: string }> => {
  try {
    // Trong thực tế, đây sẽ là API call
    // const response = await fetch(USER_PERMISSIONS_URL(userId));
    // const data = await response.json();
    
    // Mock: Tìm quyền của người dùng
    const userPermission = mockUserPermissions.find(up => up.userId === userId);
    
    if (userPermission) {
      return {
        success: true,
        data: userPermission.permissions
      };
    }
    
    return {
      success: false,
      message: 'Không tìm thấy quyền của người dùng'
    };
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return {
      success: false,
      message: 'Không thể lấy quyền của người dùng'
    };
  }
};

// Hàm cập nhật quyền của người dùng
export const updateUserPermissions = async (userId: string, permissions: string[]): Promise<{ success: boolean; message?: string }> => {
  try {
    // Trong thực tế, đây sẽ là API call
    // const response = await fetch(UPDATE_USER_PERMISSIONS_URL(userId), {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ permissions })
    // });
    // const data = await response.json();
    
    // Mock: Cập nhật quyền của người dùng
    const userIndex = mockUserPermissions.findIndex(up => up.userId === userId);
    
    if (userIndex !== -1) {
      mockUserPermissions[userIndex].permissions = permissions;
      return {
        success: true,
        message: 'Cập nhật quyền thành công'
      };
    }
    
    // Nếu không tìm thấy, tạo mới
    mockUserPermissions.push({
      userId,
      permissions
    });
    
    return {
      success: true,
      message: 'Tạo quyền cho người dùng thành công'
    };
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return {
      success: false,
      message: 'Không thể cập nhật quyền của người dùng'
    };
  }
};

// Hàm kiểm tra người dùng có quyền hay không
export const hasPermission = (userPermissions: string[], permissionCode: string): boolean => {
  return userPermissions.includes(permissionCode);
}; 
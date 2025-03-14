import axios from 'axios';
import { API_BASE_URL } from '../constants/apiUrls';
import { User, UserFilter, UserCreateRequest, UserUpdateRequest, UserResponse } from '../models/User';
import { getCookie } from '../utils/authUtils';

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    userId: '11378',
    userName: 'qlshop555',
    email: 'qlshop555@pos.vn',
    phone: '0987405607',
    code: '24090',
    department: 'SHOP',
    position: 'Leader',
    major: 'Quản lý cửa hàng',
    workLocation: '555 3 tháng 2',
    status: 'ACTIVE',
    createdAt: '2024-07-22 10:11:32'
  },
  {
    id: 2,
    userId: '197',
    userName: 'Shop555',
    email: 'shop555@pos.vn',
    status: 'ACTIVE',
    createdAt: '2023-08-01 13:07:31'
  },
  {
    id: 3,
    userId: '195',
    userName: 'Shop119',
    email: 'shop119@pos.vn',
    phone: '000000119',
    code: '21163',
    department: 'SHOP',
    position: 'Leader',
    major: 'Quản lý cửa hàng',
    workLocation: '119 Nguyễn Gia Trí',
    status: 'ACTIVE',
    createdAt: '2023-08-01 13:07:31'
  },
  {
    id: 4,
    userId: '196',
    userName: 'Shop176',
    email: 'shop176@pos.vn',
    status: 'ACTIVE',
    createdAt: '2023-08-01 13:07:31'
  }
];

// Hàm lấy danh sách người dùng
export const getUsers = async (
  page: number = 1, 
  size: number = 10, 
  filter?: UserFilter
): Promise<UserResponse> => {
  try {
    // Trong môi trường thực tế, chúng ta sẽ gọi API thực
    // const token = getCookie('token');
    // const response = await axios.get(`${API_BASE_URL}/users`, {
    //   params: { page, size, ...filter },
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.data;

    // Mock data cho mục đích phát triển
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredUsers = [...mockUsers];

        // Áp dụng bộ lọc
        if (filter) {
          if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
              user.userName.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower) ||
              user.userId.toLowerCase().includes(searchLower)
            );
          }

          if (filter.status) {
            filteredUsers = filteredUsers.filter(user => 
              user.status === filter.status
            );
          }

          if (filter.department) {
            filteredUsers = filteredUsers.filter(user => 
              user.department === filter.department
            );
          }

          if (filter.location) {
            filteredUsers = filteredUsers.filter(user => 
              user.workLocation && user.workLocation.includes(filter.location || '')
            );
          }

          if (filter.position) {
            filteredUsers = filteredUsers.filter(user => 
              user.position === filter.position
            );
          }

          if (filter.major) {
            filteredUsers = filteredUsers.filter(user => 
              user.major === filter.major
            );
          }
        }

        // Phân trang
        const totalItems = filteredUsers.length;
        const totalPages = Math.ceil(totalItems / size);
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        resolve({
          success: true,
          data: paginatedUsers,
          totalItems,
          totalPages,
          currentPage: page
        });
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách người dùng'
    };
  }
};

// Hàm tạo người dùng mới
export const createUser = async (userData: UserCreateRequest): Promise<UserResponse> => {
  try {
    // Trong môi trường thực tế, chúng ta sẽ gọi API thực
    // const token = getCookie('token');
    // const response = await axios.post(`${API_BASE_URL}/users`, userData, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.data;

    // Mock data cho mục đích phát triển
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: mockUsers.length + 1,
          userId: Math.floor(Math.random() * 1000).toString(),
          userName: userData.userName,
          email: userData.email,
          phone: userData.phone,
          code: userData.code,
          department: userData.department,
          position: userData.position,
          major: userData.major,
          workLocation: userData.workLocation,
          status: 'ACTIVE',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        mockUsers.push(newUser);

        resolve({
          success: true,
          data: [newUser],
          message: 'Tạo người dùng thành công'
        });
      }, 500);
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi tạo người dùng'
    };
  }
};

// Hàm cập nhật thông tin người dùng
export const updateUser = async (id: number, userData: UserUpdateRequest): Promise<UserResponse> => {
  try {
    // Trong môi trường thực tế, chúng ta sẽ gọi API thực
    // const token = getCookie('token');
    // const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.data;

    // Mock data cho mục đích phát triển
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = mockUsers.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
          resolve({
            success: false,
            message: 'Không tìm thấy người dùng'
          });
          return;
        }

        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...userData
        };

        resolve({
          success: true,
          data: [mockUsers[userIndex]],
          message: 'Cập nhật người dùng thành công'
        });
      }, 500);
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật người dùng'
    };
  }
};

// Hàm xóa người dùng
export const deleteUser = async (id: number): Promise<UserResponse> => {
  try {
    // Trong môi trường thực tế, chúng ta sẽ gọi API thực
    // const token = getCookie('token');
    // const response = await axios.delete(`${API_BASE_URL}/users/${id}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.data;

    // Mock data cho mục đích phát triển
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = mockUsers.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
          resolve({
            success: false,
            message: 'Không tìm thấy người dùng'
          });
          return;
        }

        const deletedUser = mockUsers[userIndex];
        mockUsers.splice(userIndex, 1);

        resolve({
          success: true,
          data: [deletedUser],
          message: 'Xóa người dùng thành công'
        });
      }, 500);
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi xóa người dùng'
    };
  }
}; 
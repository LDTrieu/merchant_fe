export interface User {
  id: number;
  userId: string;
  userName: string;
  email: string;
  phone?: string;
  code?: string;
  department?: string;
  position?: string;
  major?: string;
  workLocation?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface UserFilter {
  search?: string;
  status?: string;
  location?: string;
  department?: string;
  position?: string;
  major?: string;
}

export interface UserCreateRequest {
  userName: string;
  email: string;
  phone?: string;
  code?: string;
  department?: string;
  position?: string;
  major?: string;
  workLocation?: string;
  password: string;
}

export interface UserUpdateRequest {
  userName?: string;
  email?: string;
  phone?: string;
  code?: string;
  department?: string;
  position?: string;
  major?: string;
  workLocation?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UserResponse {
  success: boolean;
  data?: User[];
  message?: string;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
} 
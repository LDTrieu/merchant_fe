import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import UserFilter from '../../components/users/UserFilter';
import UserTable from '../../components/users/UserTable';
import { User, UserFilter as UserFilterType } from '../../models/User';
import { getUsers, deleteUser } from '../../services/userService';
import '../../components/users/UserStyles.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<UserFilterType>({});

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUsers(currentPage, 10, filter);
      
      if (response.success && response.data) {
        setUsers(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setError(response.message || 'Không thể tải danh sách người dùng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải danh sách người dùng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilter = (newFilter: UserFilterType) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset về trang đầu tiên khi áp dụng bộ lọc mới
  };

  const handleView = (user: User) => {
    navigate(`/users/${user.userId}`);
  };

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
    // Implement edit user
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.userName}?`)) {
      try {
        const response = await deleteUser(user.id);
        
        if (response.success) {
          alert('Xóa người dùng thành công');
          fetchUsers(); // Tải lại danh sách sau khi xóa
        } else {
          alert(response.message || 'Không thể xóa người dùng');
        }
      } catch (err) {
        alert('Đã xảy ra lỗi khi xóa người dùng');
        console.error(err);
      }
    }
  };

  const handleCreateUser = () => {
    console.log('Create new user');
    // Implement create user
  };

  const handleExport = () => {
    console.log('Export users');
    // Implement export functionality
  };

  return (
    <Layout>
      <div className="user-management">
        <div className="page-header">
          <h1 className="page-title">Users</h1>
          <div className="action-bar">
            <button className="create-button" onClick={handleCreateUser}>
              <span>+</span> Create
            </button>
            <button className="export-button" onClick={handleExport}>
              <span>↓</span> Export
            </button>
          </div>
        </div>

        <UserFilter onFilter={handleFilter} />

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <UserTable
            users={users}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Layout>
  );
};

export default UserManagement;
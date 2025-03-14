import { useState } from 'react';
import { User } from '../../models/User';
import './UserStyles.css';

interface UserTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserTable = ({ 
  users, 
  onView, 
  onEdit, 
  onDelete, 
  currentPage, 
  totalPages, 
  onPageChange 
}: UserTableProps) => {
  const [selectedPage, setSelectedPage] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setSelectedPage(page);
    onPageChange(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages.push(
      <button 
        key="prev" 
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        &lt;
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button 
        key="next" 
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        &gt;
      </button>
    );
    
    return pages;
  };

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>User Name</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.userId}</td>
              <td>{user.userName}</td>
              <td>
                <div><strong>Email:</strong> {user.email}</div>
                {user.phone && <div><strong>Phone:</strong> {user.phone}</div>}
                {user.code && <div><strong>Code:</strong> {user.code}</div>}
                {user.department && <div><strong>Department:</strong> {user.department}</div>}
                {user.position && <div><strong>Position:</strong> {user.position}</div>}
                {user.major && <div><strong>Major:</strong> {user.major}</div>}
                {user.workLocation && <div><strong>Work Location:</strong> {user.workLocation}</div>}
              </td>
              <td>{user.createdAt}</td>
              <td>
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="action-button view"
                    onClick={() => onView(user)}
                    title="View"
                  >
                    👁️
                  </button>
                  <button 
                    className="action-button edit"
                    onClick={() => onEdit(user)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-button delete"
                    onClick={() => onDelete(user)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div className="pagination">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default UserTable; 
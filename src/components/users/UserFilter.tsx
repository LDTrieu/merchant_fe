import { useState, useEffect } from 'react';
import { UserFilter as UserFilterType } from '../../models/User';
import './UserStyles.css';

interface UserFilterProps {
  onFilter: (filter: UserFilterType) => void;
}

const UserFilter = ({ onFilter }: UserFilterProps) => {
  const [filter, setFilter] = useState<UserFilterType>({
    search: '',
    status: '',
    location: '',
    department: '',
    position: '',
    major: ''
  });

  // Danh sách các lựa chọn cho các dropdown
  const statusOptions = ['', 'ACTIVE', 'INACTIVE'];
  const locationOptions = ['', '555 3 tháng 2', '119 Nguyễn Gia Trí'];
  const departmentOptions = ['', 'SHOP', 'ADMIN', 'IT'];
  const positionOptions = ['', 'Leader', 'Staff', 'Manager'];
  const majorOptions = ['', 'Quản lý cửa hàng', 'Nhân viên bán hàng', 'Kỹ thuật viên'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleClearSearch = () => {
    setFilter(prev => ({ ...prev, search: '' }));
  };

  const handleSearch = () => {
    onFilter(filter);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    // Khi component mount, áp dụng bộ lọc ban đầu
    onFilter(filter);
  }, []);

  return (
    <div className="user-filter">
      <div className="search-container">
        <input
          type="text"
          name="search"
          value={filter.search}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search"
          className="search-input"
        />
        {filter.search && (
          <button className="clear-search" onClick={handleClearSearch}>
            ✕
          </button>
        )}
      </div>

      <div className="filter-dropdowns">
        <select 
          name="status" 
          value={filter.status} 
          onChange={handleInputChange}
          className="filter-select"
        >
          <option value="">Select Status</option>
          {statusOptions.slice(1).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select 
          name="location" 
          value={filter.location} 
          onChange={handleInputChange}
          className="filter-select"
        >
          <option value="">Select Location</option>
          {locationOptions.slice(1).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select 
          name="department" 
          value={filter.department} 
          onChange={handleInputChange}
          className="filter-select"
        >
          <option value="">Select Department</option>
          {departmentOptions.slice(1).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select 
          name="position" 
          value={filter.position} 
          onChange={handleInputChange}
          className="filter-select"
        >
          <option value="">Select Position</option>
          {positionOptions.slice(1).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select 
          name="major" 
          value={filter.major} 
          onChange={handleInputChange}
          className="filter-select"
        >
          <option value="">Select Major</option>
          {majorOptions.slice(1).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <button className="search-button" onClick={handleSearch}>
        🔍 Search
      </button>
    </div>
  );
};

export default UserFilter; 
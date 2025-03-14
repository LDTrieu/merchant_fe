import { useState, useEffect } from 'react';
import { Permission, PermissionGroup } from '../../models/Permission';
import { getAllPermissions, getUserPermissions, updateUserPermissions } from '../../services/permissionService';
import './PermissionTab.css';

interface PermissionTabProps {
  userId: string;
}

const PermissionTab: React.FC<PermissionTabProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'matrix'>('matrix');
  const [activeApp, setActiveApp] = useState<string>('');
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        // Lấy danh sách quyền của người dùng
        const userPermsResponse = await getUserPermissions(userId);
        if (userPermsResponse.success && userPermsResponse.data) {
          setUserPermissions(userPermsResponse.data);
        } else {
          setError(userPermsResponse.message || 'Không thể tải quyền người dùng');
        }
        
        // Lấy tất cả các nhóm quyền
        const groupsResponse = await getAllPermissions();
        if (groupsResponse.success && groupsResponse.data) {
          setPermissionGroups(groupsResponse.data);
          
          // Tạo danh sách tất cả các quyền từ các nhóm
          const allPerms: Permission[] = [];
          groupsResponse.data.forEach(group => {
            group.permissions.forEach(perm => {
              allPerms.push({
                ...perm,
                appName: group.appName
              });
            });
          });
          setAllPermissions(allPerms);
          
          if (groupsResponse.data.length > 0) {
            setActiveApp(groupsResponse.data[0].appCode);
          }
        } else {
          setError(groupsResponse.message || 'Không thể tải danh sách quyền');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Không thể tải dữ liệu quyền');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchPermissions();
  }, [userId]);

  const handlePermissionChange = (permissionCode: string, isChecked: boolean) => {
    setUserPermissions(prev => {
      if (isChecked) {
        return [...prev, permissionCode];
      } else {
        return prev.filter(p => p !== permissionCode);
      }
    });
  };

  const handleSavePermissions = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      
      const result = await updateUserPermissions(userId, userPermissions);
      
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError('Không thể lưu quyền người dùng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi lưu quyền');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAppChange = (appCode: string) => {
    setActiveApp(appCode);
  };

  const renderTableView = () => {
    return (
      <div className="permission-table-container">
        <table className="permission-table">
          <thead>
            <tr>
              <th>Ứng dụng</th>
              <th>Module</th>
              <th>Mã quyền</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {permissionGroups.map(group => (
              group.permissions.map(permission => (
                <tr key={permission.code}>
                  <td>{group.appName}</td>
                  <td>{permission.module}</td>
                  <td>{permission.code}</td>
                  <td>{permission.description}</td>
                  <td>
                    <div 
                      className={userPermissions.includes(permission.code) ? "checkmark" : "empty-check"}
                      onClick={() => handlePermissionChange(permission.code, !userPermissions.includes(permission.code))}
                    >
                      {userPermissions.includes(permission.code) && <span className="checkmark-icon"></span>}
                    </div>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMatrixView = () => {
    // Hàm render ô checkbox hoặc dấu check
    const renderCheckCell = (permissionCode: string | undefined) => {
      if (!permissionCode) return <div></div>;
      
      const isChecked = userPermissions.includes(permissionCode);
      
      return (
        <div 
          className={isChecked ? "checkmark" : "empty-check"}
          onClick={() => handlePermissionChange(permissionCode, !isChecked)}
          title={permissionCode}
        >
          {isChecked && <span className="checkmark-icon"></span>}
        </div>
      );
    };
    
    return (
      <div className="permission-matrix-container">
        <table className="permission-matrix">
          <thead>
            <tr>
              <th rowSpan={2}>App</th>
              <th rowSpan={2}>Module</th>
              <th colSpan={4} className="column-group">Quản lý dữ liệu</th>
              <th colSpan={3} className="column-group">Xem & In</th>
              <th colSpan={4} className="column-group">Phê duyệt & Xác nhận</th>
              <th colSpan={3} className="column-group">Xuất & Nhập</th>
            </tr>
            <tr>
              <th>list</th>
              <th>create</th>
              <th>update</th>
              <th>delete</th>
              <th>preview</th>
              <th>print</th>
              <th>search</th>
              <th>approve</th>
              <th>verify</th>
              <th>receive</th>
              <th>import</th>
              <th>export</th>
              <th>upload</th>
            </tr>
          </thead>
          <tbody>
            {permissionGroups.map(group => (
              <tr key={group.appCode}>
                <td className="app-name">{group.appName}</td>
                <td colSpan={14}>
                  <table className="inner-matrix">
                    <tbody>
                      {group.permissions.reduce((acc: any[], permission) => {
                        // Nhóm theo module
                        const moduleIndex = acc.findIndex(item => item.module === permission.module);
                        
                        if (moduleIndex === -1) {
                          acc.push({
                            module: permission.module,
                            permissions: [permission]
                          });
                        } else {
                          acc[moduleIndex].permissions.push(permission);
                        }
                        
                        return acc;
                      }, []).map(moduleGroup => (
                        <tr key={moduleGroup.module}>
                          <td className="module-name">{moduleGroup.module}</td>
                          <td className="permission-cell">
                            {renderCheckCell(moduleGroup.permissions.find(p => p.code.includes('.view'))?.code)}
                          </td>
                          <td className="permission-cell">
                            {renderCheckCell(moduleGroup.permissions.find(p => p.code.includes('.create'))?.code)}
                          </td>
                          <td className="permission-cell">
                            {renderCheckCell(moduleGroup.permissions.find(p => p.code.includes('.update'))?.code)}
                          </td>
                          <td className="permission-cell">
                            {renderCheckCell(moduleGroup.permissions.find(p => p.code.includes('.delete'))?.code)}
                          </td>
                          <td className="permission-cell"></td>
                          <td className="permission-cell"></td>
                          <td className="permission-cell"></td>
                          <td className="permission-cell">
                            {renderCheckCell(moduleGroup.permissions.find(p => p.code.includes('.approve'))?.code)}
                          </td>
                          <td className="permission-cell"></td>
                          <td className="permission-cell"></td>
                          <td className="permission-cell"></td>
                          <td className="permission-cell">
                            {renderCheckCell(moduleGroup.permissions.find(p => p.code.includes('.export'))?.code)}
                          </td>
                          <td className="permission-cell"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="permission-tab">
      {loading ? (
        <div className="loading">Đang tải dữ liệu quyền...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="permission-controls">
            <div className="view-toggle">
              <button 
                className={viewMode === 'table' ? 'active' : ''} 
                onClick={() => setViewMode('table')}
              >
                Xem dạng bảng
              </button>
              <button 
                className={viewMode === 'matrix' ? 'active' : ''} 
                onClick={() => setViewMode('matrix')}
              >
                Xem dạng ma trận
              </button>
            </div>
            
            {viewMode === 'table' && (
              <div className="app-filter">
                <label>Chọn ứng dụng:</label>
                <select value={activeApp} onChange={(e) => handleAppChange(e.target.value)}>
                  {permissionGroups.map(group => (
                    <option key={group.appCode} value={group.appCode}>
                      {group.appName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {viewMode === 'table' ? renderTableView() : renderMatrixView()}
          
          <div className="permission-actions">
            <button 
              className="save-button" 
              onClick={handleSavePermissions} 
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            
            {saveSuccess && (
              <div className="save-success">Đã lưu thành công!</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PermissionTab; 
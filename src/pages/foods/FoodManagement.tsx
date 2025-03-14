import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, TextField, MenuItem, Select, FormControl, InputLabel, IconButton,
  Chip, Box, Typography, Grid, InputAdornment, Pagination, Tooltip, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Food, FoodFilter } from '../../models/Food';
import { getFoods, foodCategories } from '../../services/foodService';
import '../../styles/FoodManagement.css';

const FoodManagement: React.FC = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Phân trang
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  
  // Bộ lọc
  const [filter, setFilter] = useState<FoodFilter>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Tải dữ liệu món ăn
  const loadFoods = async () => {
    setLoading(true);
    try {
      const response = await getFoods(page, limit, filter);
      setFoods(response.data);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách món ăn. Vui lòng thử lại sau.');
      console.error('Error loading foods:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Tải dữ liệu khi component mount hoặc khi các tham số thay đổi
  useEffect(() => {
    loadFoods();
  }, [page, limit, filter]);
  
  // Xử lý thay đổi trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // Xử lý tìm kiếm
  const handleSearch = () => {
    setFilter(prev => ({ ...prev, search: searchTerm }));
    setPage(1);
  };
  
  // Xử lý nhấn Enter khi tìm kiếm
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (name: string, value: string) => {
    setFilter(prev => ({ ...prev, [name]: value || undefined }));
    setPage(1);
  };
  
  // Xử lý xem chi tiết món ăn
  const handleView = (food: Food) => {
    navigate(`/foods/${food.id}`);
  };
  
  // Xử lý chỉnh sửa món ăn
  const handleEdit = (food: Food) => {
    navigate(`/foods/${food.id}/edit`);
  };
  
  // Xử lý xóa món ăn
  const handleDelete = (food: Food) => {
    // Trong thực tế, đây sẽ hiển thị hộp thoại xác nhận trước khi xóa
    if (window.confirm(`Bạn có chắc chắn muốn xóa món "${food.name}"?`)) {
      // Gọi API xóa món ăn
      console.log('Deleting food:', food);
    }
  };
  
  // Xử lý tạo món ăn mới
  const handleCreate = () => {
    navigate('/foods/create');
  };
  
  // Xử lý xuất dữ liệu
  const handleExport = () => {
    console.log('Exporting food data...');
    // Trong thực tế, đây sẽ gọi API để xuất dữ liệu
  };
  
  // Hiển thị trạng thái món ăn
  const renderStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label="Đang bán" color="success" size="small" />;
      case 'OUT_OF_STOCK':
        return <Chip label="Hết hàng" color="warning" size="small" />;
      case 'INACTIVE':
        return <Chip label="Ngừng bán" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  return (
    <Layout>
      <div className="food-management-container">
        <div className="food-management-header">
          <Typography variant="h5" component="h1">
            Quản lý món ăn
          </Typography>
          <div className="food-management-actions">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Thêm món ăn
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
            >
              Xuất dữ liệu
            </Button>
          </div>
        </div>
        
        <Paper className="food-management-filter-container">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo tên, SKU, mô tả..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch} edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} className="filter-toggle-container">
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
              </Button>
            </Grid>
            
            {showFilters && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Loại món ăn</InputLabel>
                    <Select
                      value={filter.category || ''}
                      label="Loại món ăn"
                      onChange={(e) => handleFilterChange('category', e.target.value as string)}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      {foodCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={filter.status || ''}
                      label="Trạng thái"
                      onChange={(e) => handleFilterChange('status', e.target.value as any)}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="ACTIVE">Đang bán</MenuItem>
                      <MenuItem value="OUT_OF_STOCK">Hết hàng</MenuItem>
                      <MenuItem value="INACTIVE">Ngừng bán</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
        
        {loading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="error-container">
            <Typography color="error">{error}</Typography>
            <Button variant="contained" onClick={loadFoods}>
              Thử lại
            </Button>
          </div>
        ) : (
          <>
            <TableContainer component={Paper} className="food-table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="5%">#</TableCell>
                    <TableCell width="10%">Hình ảnh</TableCell>
                    <TableCell width="10%">SKU</TableCell>
                    <TableCell width="25%">Tên món</TableCell>
                    <TableCell width="15%">Loại</TableCell>
                    <TableCell width="15%">Giá</TableCell>
                    <TableCell width="10%">Trạng thái</TableCell>
                    <TableCell width="10%">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foods.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    foods.map((food, index) => (
                      <TableRow key={food.id}>
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell>
                          <div className="food-image-container">
                            <img 
                              src={food.image || 'https://dummyimage.com/80x80/cccccc/ffffff&text=No+Image'} 
                              alt={food.name}
                              className="food-thumbnail"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://dummyimage.com/80x80/cccccc/ffffff&text=No+Image';
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{food.sku}</TableCell>
                        <TableCell>{food.name}</TableCell>
                        <TableCell>{food.category}</TableCell>
                        <TableCell>{formatPrice(food.price)}</TableCell>
                        <TableCell>{renderStatus(food.status)}</TableCell>
                        <TableCell>
                          <div className="action-buttons">
                            <Tooltip title="Xem chi tiết">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleView(food)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Chỉnh sửa">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(food)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDelete(food)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <div className="pagination-container">
              <Pagination
                count={Math.ceil(total / limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
              <Typography variant="body2">
                Hiển thị {foods.length} / {total} món ăn
              </Typography>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FoodManagement; 
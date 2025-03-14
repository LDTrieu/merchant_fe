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
import { Order, OrderFilter, OrderStatus, PaymentMethod, PaymentStatus } from '../../models/Order';
import { getOrders, orderStatuses, paymentMethods, paymentStatuses } from '../../services/orderService';
import '../../styles/OrderManagement.css';

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Phân trang
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  
  // Bộ lọc
  const [filter, setFilter] = useState<OrderFilter>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Tải dữ liệu đơn hàng
  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders(page, limit, filter);
      setOrders(response.data);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Tải dữ liệu khi component mount hoặc khi các tham số thay đổi
  useEffect(() => {
    loadOrders();
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
  const handleFilterChange = (name: string, value: any) => {
    setFilter(prev => ({ ...prev, [name]: value || undefined }));
    setPage(1);
  };
  
  // Xử lý xem chi tiết đơn hàng
  const handleView = (order: Order) => {
    navigate(`/orders/${order.id}`);
  };
  
  // Xử lý chỉnh sửa đơn hàng
  const handleEdit = (order: Order) => {
    navigate(`/orders/${order.id}/edit`);
  };
  
  // Xử lý xóa đơn hàng
  const handleDelete = (order: Order) => {
    // Trong thực tế, đây sẽ hiển thị hộp thoại xác nhận trước khi xóa
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng "${order.orderNumber}"?`)) {
      // Gọi API xóa đơn hàng
      console.log('Deleting order:', order);
    }
  };
  
  // Xử lý tạo đơn hàng mới
  const handleCreate = () => {
    navigate('/orders/create');
  };
  
  // Xử lý xuất dữ liệu
  const handleExport = () => {
    console.log('Exporting order data...');
    // Trong thực tế, đây sẽ gọi API để xuất dữ liệu
  };
  
  // Hiển thị trạng thái đơn hàng
  const renderOrderStatus = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Chờ xử lý" color="warning" size="small" className="order-status-chip" />;
      case 'PROCESSING':
        return <Chip label="Đang xử lý" color="info" size="small" className="order-status-chip" />;
      case 'COMPLETED':
        return <Chip label="Hoàn thành" color="success" size="small" className="order-status-chip" />;
      case 'CANCELLED':
        return <Chip label="Đã hủy" color="error" size="small" className="order-status-chip" />;
      default:
        return <Chip label={status} size="small" className="order-status-chip" />;
    }
  };
  
  // Hiển thị trạng thái thanh toán
  const renderPaymentStatus = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Chờ thanh toán" color="warning" size="small" />;
      case 'PAID':
        return <Chip label="Đã thanh toán" color="success" size="small" />;
      case 'REFUNDED':
        return <Chip label="Đã hoàn tiền" color="info" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  // Format thời gian
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Layout>
      <div className="order-management-container">
        <div className="order-management-header">
          <Typography variant="h5" component="h1">
            Quản lý đơn hàng
          </Typography>
          <div className="order-management-actions">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Tạo đơn hàng
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
        
        <Paper className="order-management-filter-container">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo mã đơn, tên khách hàng, số điện thoại..."
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
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Trạng thái đơn hàng</InputLabel>
                    <Select
                      value={filter.status || ''}
                      label="Trạng thái đơn hàng"
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      {orderStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status === 'PENDING' && 'Chờ xử lý'}
                          {status === 'PROCESSING' && 'Đang xử lý'}
                          {status === 'COMPLETED' && 'Hoàn thành'}
                          {status === 'CANCELLED' && 'Đã hủy'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Phương thức thanh toán</InputLabel>
                    <Select
                      value={filter.paymentMethod || ''}
                      label="Phương thức thanh toán"
                      onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      {paymentMethods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method === 'CASH' && 'Tiền mặt'}
                          {method === 'CARD' && 'Thẻ'}
                          {method === 'TRANSFER' && 'Chuyển khoản'}
                          {method === 'MOMO' && 'MoMo'}
                          {method === 'ZALOPAY' && 'ZaloPay'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Trạng thái thanh toán</InputLabel>
                    <Select
                      value={filter.paymentStatus || ''}
                      label="Trạng thái thanh toán"
                      onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      {paymentStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status === 'PENDING' && 'Chờ thanh toán'}
                          {status === 'PAID' && 'Đã thanh toán'}
                          {status === 'REFUNDED' && 'Đã hoàn tiền'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <div className="date-filter-container">
                    <TextField
                      label="Từ ngày"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Đến ngày"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => handleFilterChange('toDate', e.target.value)}
                      fullWidth
                    />
                  </div>
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
            <Button variant="contained" onClick={loadOrders}>
              Thử lại
            </Button>
          </div>
        ) : (
          <>
            <TableContainer component={Paper} className="order-table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="10%">Mã đơn</TableCell>
                    <TableCell width="15%">Khách hàng</TableCell>
                    <TableCell width="20%">Món ăn</TableCell>
                    <TableCell width="15%">Tổng tiền</TableCell>
                    <TableCell width="10%">Trạng thái</TableCell>
                    <TableCell width="10%">Thanh toán</TableCell>
                    <TableCell width="10%">Thời gian</TableCell>
                    <TableCell width="10%">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Không có đơn hàng nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell>
                          <div>{order.customerName}</div>
                          {order.customerPhone && (
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                              {order.customerPhone}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <ul className="order-items-list">
                            {order.items.slice(0, 2).map((item) => (
                              <li key={item.id}>
                                {item.foodName} x{item.quantity}
                              </li>
                            ))}
                            {order.items.length > 2 && (
                              <li>
                                <span className="order-items-count">+{order.items.length - 2}</span>
                              </li>
                            )}
                          </ul>
                        </TableCell>
                        <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                        <TableCell>{renderOrderStatus(order.status)}</TableCell>
                        <TableCell>
                          <div>{order.paymentMethod}</div>
                          <div>{renderPaymentStatus(order.paymentStatus)}</div>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="action-buttons">
                            <Tooltip title="Xem chi tiết">
                              <IconButton size="small" onClick={() => handleView(order)}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Chỉnh sửa">
                              <IconButton size="small" onClick={() => handleEdit(order)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton size="small" onClick={() => handleDelete(order)}>
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
              <Typography variant="body2">
                Hiển thị {orders.length} / {total} đơn hàng
              </Typography>
              <Pagination
                count={Math.ceil(total / limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default OrderManagement; 
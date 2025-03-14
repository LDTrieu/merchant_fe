import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { 
  TextField, Button, IconButton, Typography, Paper, Grid, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  FormControl, InputLabel, Select, MenuItem, InputAdornment,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CakeIcon from '@mui/icons-material/Cake';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';
import { Food } from '../../models/Food';
import { Cart, CartItem, OrderForm } from '../../models/Cart';
import { PaymentMethod } from '../../models/Order';
import { getFoods, foodCategories } from '../../services/foodService';
import { 
  addToCart, updateCartItemQuantity, removeFromCart, 
  getCart, clearCart, updateDiscount, updateTax, createOrderFromCart 
} from '../../services/cartService';
import { generateCartPDF, downloadCartPDF } from '../../services/pdfService';
import '../../styles/OrderCreate.css';

const OrderCreate: React.FC = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [cart, setCart] = useState<Cart>(getCart());
  
  // Dialog để xác nhận đơn hàng
  const [openOrderDialog, setOpenOrderDialog] = useState<boolean>(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: '',
    customerPhone: '',
    paymentMethod: 'CASH',
    note: ''
  });
  const [orderLoading, setOrderLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Dialog hiển thị PDF hóa đơn
  const [openPdfDialog, setOpenPdfDialog] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Tải dữ liệu món ăn
  const loadFoods = async () => {
    setLoading(true);
    try {
      const response = await getFoods(1, 100, { 
        search: searchTerm,
        category: selectedCategory
      });
      setFoods(response.data);
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
  }, [searchTerm, selectedCategory]);
  
  // Cập nhật giỏ hàng khi có thay đổi
  useEffect(() => {
    // Cập nhật thuế (1.5%)
    updateTax(1.5);
    setCart(getCart());
  }, [cart.items.length]);
  
  // Xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Xử lý chọn danh mục
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };
  
  // Xử lý thêm món ăn vào giỏ hàng
  const handleAddToCart = (food: Food) => {
    addToCart(food, 1);
    setCart(getCart());
    showSnackbar('Đã thêm món ăn vào giỏ hàng', 'success');
  };
  
  // Xử lý tăng số lượng món ăn trong giỏ hàng
  const handleIncreaseQuantity = (itemId: string) => {
    const item = cart.items.find(item => item.id === itemId);
    if (item) {
      updateCartItemQuantity(itemId, item.quantity + 1);
      setCart(getCart());
    }
  };
  
  // Xử lý giảm số lượng món ăn trong giỏ hàng
  const handleDecreaseQuantity = (itemId: string) => {
    const item = cart.items.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      updateCartItemQuantity(itemId, item.quantity - 1);
      setCart(getCart());
    } else {
      handleRemoveFromCart(itemId);
    }
  };
  
  // Xử lý xóa món ăn khỏi giỏ hàng
  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId);
    setCart(getCart());
    showSnackbar('Đã xóa món ăn khỏi giỏ hàng', 'success');
  };
  
  // Xử lý xóa toàn bộ giỏ hàng
  const handleClearCart = () => {
    clearCart();
    setCart(getCart());
    showSnackbar('Đã làm mới giỏ hàng', 'success');
    // Tải lại danh sách món ăn để cập nhật UI
    loadFoods();
  };
  
  // Xử lý cập nhật giảm giá
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = parseFloat(e.target.value) || 0;
    updateDiscount(discount);
    setCart(getCart());
  };
  
  // Xử lý mở dialog xác nhận đơn hàng
  const handleOpenOrderDialog = () => {
    if (cart.items.length === 0) {
      showSnackbar('Giỏ hàng trống. Vui lòng thêm món ăn vào giỏ hàng.', 'error');
      return;
    }
    
    // Đặt giá trị mặc định cho tên khách hàng
    setOrderForm(prev => ({
      ...prev,
      customerName: 'Khách lẻ'
    }));
    
    setOpenOrderDialog(true);
  };
  
  // Xử lý đóng dialog xác nhận đơn hàng
  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
  };
  
  // Xử lý thay đổi thông tin đơn hàng
  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | any) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name as string]: value
    }));
  };
  
  // Xử lý tạo đơn hàng và hiển thị PDF
  const handleCreateOrder = async () => {
    setOrderLoading(true);
    try {
      // Tạo URL cho PDF từ giỏ hàng
      const pdfUrl = generateCartPDF(cart, orderForm);
      setPdfUrl(pdfUrl);
      
      // Đóng dialog xác nhận đơn hàng
      handleCloseOrderDialog();
      
      // Mở dialog hiển thị PDF
      setOpenPdfDialog(true);
      
      // Tạo đơn hàng trong hệ thống
      const order = await createOrderFromCart(
        orderForm.customerName,
        orderForm.paymentMethod as PaymentMethod,
        orderForm.customerPhone,
        orderForm.note
      );
      
      showSnackbar('Đặt hàng thành công!', 'success');
      
      // Tải lại danh sách món ăn để cập nhật UI
      loadFoods();
    } catch (err) {
      console.error('Error creating order:', err);
      showSnackbar('Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.', 'error');
    } finally {
      setOrderLoading(false);
    }
  };
  
  // Xử lý đóng dialog PDF
  const handleClosePdfDialog = () => {
    setOpenPdfDialog(false);
    // Xóa giỏ hàng sau khi đóng PDF
    clearCart();
    setCart(getCart());
    // Tải lại danh sách món ăn để cập nhật UI
    loadFoods();
  };
  
  // Xử lý tải xuống PDF
  const handleDownloadPdf = () => {
    downloadCartPDF(cart, orderForm);
  };
  
  // Hiển thị thông báo
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // Đóng thông báo
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  // Lấy icon cho danh mục
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cà Phê Việt Nam':
      case 'Cà Phê Máy':
        return <LocalCafeIcon />;
      case 'Trà Trái Cây':
      case 'Trà Sữa':
        return <LocalBarIcon />;
      case 'Bánh ngọt':
        return <CakeIcon />;
      case 'Bánh mặn':
        return <RestaurantIcon />;
      default:
        return <FastfoodIcon />;
    }
  };
  
  return (
    <Layout>
      <div className="order-create-container">
        {/* Phần menu */}
        <div className="menu-section">
          <div className="menu-header-container">
            <div className="menu-header">
              <Typography variant="h5" component="h1">
                Đặt món
              </Typography>
              {cart.items.length > 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleClearCart}
                  startIcon={<RestartAltIcon />}
                  size="small"
                >
                  Làm mới
                </Button>
              )}
            </div>
            
            {/* Thanh tìm kiếm */}
            <TextField
              className="search-bar"
              fullWidth
              placeholder="Tìm kiếm món ăn..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            {/* Tabs danh mục */}
            <div className="category-tabs">
              {foodCategories.map((category) => (
                <div
                  key={category}
                  className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  <span className="category-tab-icon">
                    {getCategoryIcon(category)}
                  </span>
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="food-content">
            {/* Danh sách món ăn */}
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
              <div className="food-grid">
                {foods.length === 0 ? (
                  <Typography>Không tìm thấy món ăn nào</Typography>
                ) : (
                  foods.map((food) => (
                    <div
                      key={food.id}
                      className="food-card"
                      onClick={() => handleAddToCart(food)}
                    >
                      <div className="food-image-container">
                        <img
                          src={food.image || 'https://dummyimage.com/200x150/cccccc/ffffff&text=No+Image'}
                          alt={food.name}
                          className="food-image"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://dummyimage.com/200x150/cccccc/ffffff&text=No+Image';
                          }}
                        />
                      </div>
                      <div className="food-details">
                        <div className="food-name">{food.name}</div>
                        <div className="food-price">{formatPrice(food.price)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Phần giỏ hàng */}
        <div className="cart-section">
          <div className="cart-header">
            Giỏ hàng ({cart.items.length})
          </div>
          
          {cart.items.length === 0 ? (
            <div className="empty-cart-message">
              <ShoppingCartIcon className="empty-cart-icon" />
              <Typography>Giỏ hàng trống</Typography>
              <Typography variant="body2">
                Vui lòng chọn món ăn để thêm vào giỏ hàng
              </Typography>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.foodName}</div>
                      <div className="cart-item-price">{formatPrice(item.price)}</div>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <div
                          className="quantity-button"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          <RemoveIcon fontSize="small" />
                        </div>
                        <div className="quantity-value">{item.quantity}</div>
                        <div
                          className="quantity-button"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          <AddIcon fontSize="small" />
                        </div>
                      </div>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="summary-row">
                  <div>Tạm tính:</div>
                  <div>{formatPrice(cart.totalAmount)}</div>
                </div>
                <div className="summary-row">
                  <div>Giảm giá:</div>
                  <TextField
                    size="small"
                    type="number"
                    value={cart.discount}
                    onChange={handleDiscountChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">đ</InputAdornment>,
                    }}
                    sx={{ width: '120px' }}
                  />
                </div>
                <div className="summary-row">
                  <div>Thuế (1.5%):</div>
                  <div>{formatPrice(cart.tax)}</div>
                </div>
                <div className="summary-row total">
                  <div>Tổng cộng:</div>
                  <div>{formatPrice(cart.finalAmount)}</div>
                </div>
              </div>
              
              <div className="cart-actions">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleOpenOrderDialog}
                >
                  Thanh toán
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Dialog xác nhận đơn hàng */}
      <Dialog open={openOrderDialog} onClose={handleCloseOrderDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận đơn hàng</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Danh sách món ăn */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Danh sách món ăn:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: '200px', overflow: 'auto' }}>
                {cart.items.map((item) => (
                  <Grid container key={item.id} spacing={1} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2">{item.foodName}</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: 'center' }}>
                      <Typography variant="body2">x{item.quantity}</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">{formatPrice(item.price * item.quantity)}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phương thức thanh toán</InputLabel>
                <Select
                  name="paymentMethod"
                  value={orderForm.paymentMethod}
                  label="Phương thức thanh toán"
                  onChange={handleOrderFormChange}
                >
                  <MenuItem value="CASH">Tiền mặt</MenuItem>
                  <MenuItem value="CARD">Thẻ</MenuItem>
                  <MenuItem value="TRANSFER">Chuyển khoản</MenuItem>
                  <MenuItem value="MOMO">MoMo</MenuItem>
                  <MenuItem value="ZALOPAY">ZaloPay</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="note"
                label="Ghi chú"
                fullWidth
                multiline
                rows={2}
                value={orderForm.note}
                onChange={handleOrderFormChange}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography variant="body1">Tạm tính:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">{formatPrice(cart.totalAmount)}</Typography>
                </Grid>
              </Grid>
              
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography variant="body1">Giảm giá:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">{formatPrice(cart.discount)}</Typography>
                </Grid>
              </Grid>
              
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography variant="body1">Thuế (1.5%):</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">{formatPrice(cart.tax)}</Typography>
                </Grid>
              </Grid>
              
              <Grid container justifyContent="space-between" sx={{ mt: 1, pt: 1, borderTop: '1px dashed #ccc' }}>
                <Grid item>
                  <Typography variant="subtitle1" fontWeight="bold">Tổng cộng:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    {formatPrice(cart.finalAmount)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog}>Hủy</Button>
          <Button
            onClick={handleCreateOrder}
            variant="contained"
            color="primary"
            disabled={orderLoading}
          >
            {orderLoading ? <CircularProgress size={24} /> : 'Thanh toán'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog hiển thị PDF hóa đơn */}
      <Dialog 
        open={openPdfDialog} 
        onClose={handleClosePdfDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ 
          style: { 
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          } 
        }}
      >
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Hóa đơn</span>
            <div>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPdf}
              >
                In hóa đơn
              </Button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
          <iframe 
            ref={iframeRef}
            src={pdfUrl} 
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none' 
            }}
            title="Hóa đơn"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePdfDialog} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default OrderCreate; 
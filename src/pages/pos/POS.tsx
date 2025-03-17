import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import {
  TextField,
  Button,
  IconButton,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CakeIcon from "@mui/icons-material/Cake";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Food } from "../../models/Food";
import { Cart, CartItem, OrderForm } from "../../models/Cart";
import { PaymentMethod } from "../../models/Order";
import { getFoods, foodCategories } from "../../services/foodService";
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  getCart,
  clearCart,
  updateDiscount,
} from "../../services/cartService";
import { createOrder } from "../../services/orderService";
import { generateCartPDF } from "../../services/pdfService";
import "../../styles/POS.css";

const POS: React.FC = () => {
  // State cho danh sách món ăn
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // State cho giỏ hàng
  const [cart, setCart] = useState<Cart>(getCart());

  // State cho dialog đặt hàng
  const [orderDialogOpen, setOrderDialogOpen] = useState<boolean>(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: "",
    customerPhone: "",
    note: "",
    paymentMethod: "CASH",
  });
  const [orderLoading, setOrderLoading] = useState<boolean>(false);

  // State cho thông báo
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Load danh sách món ăn khi component được mount
  useEffect(() => {
    loadFoods();
  }, []);

  // Cập nhật giỏ hàng vào localStorage khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Hàm load danh sách món ăn
  const loadFoods = async () => {
    setLoading(true);
    try {
      const response = await getFoods();
      if (response.success) {
        setFoods(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách món ăn");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi khi tải danh sách món ăn");
      console.error("Error loading foods:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lọc danh sách món ăn theo từ khóa tìm kiếm và danh mục
  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? food.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý chọn danh mục
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  // Xử lý thêm món vào giỏ hàng
  const handleAddToCart = (food: Food) => {
    const updatedCart = addToCart(food);
    setCart(updatedCart);
  };

  // Xử lý tăng số lượng món trong giỏ hàng
  const handleIncreaseQuantity = (itemId: string) => {
    const item = cart.items.find((item) => item.id === itemId);
    if (item) {
      const updatedCart = updateCartItemQuantity(itemId, item.quantity + 1);
      setCart(updatedCart);
    }
  };

  // Xử lý giảm số lượng món trong giỏ hàng
  const handleDecreaseQuantity = (itemId: string) => {
    const item = cart.items.find((item) => item.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        const updatedCart = updateCartItemQuantity(itemId, item.quantity - 1);
        setCart(updatedCart);
      } else {
        const updatedCart = removeFromCart(itemId);
        setCart(updatedCart);
      }
    }
  };

  // Xử lý xóa món khỏi giỏ hàng
  const handleRemoveFromCart = (itemId: string) => {
    const updatedCart = removeFromCart(itemId);
    setCart(updatedCart);
  };

  // Xử lý xóa toàn bộ giỏ hàng
  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      const updatedCart = clearCart();
      setCart(updatedCart);
    }
  };

  // Xử lý thay đổi giảm giá
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const updatedCart = updateDiscount(value);
    setCart(updatedCart);
  };

  // Xử lý mở dialog đặt hàng
  const handleOpenOrderDialog = () => {
    if (cart.items.length === 0) {
      showSnackbar(
        "Giỏ hàng trống. Vui lòng thêm món ăn vào giỏ hàng.",
        "error"
      );
      return;
    }
    setOrderDialogOpen(true);
  };

  // Xử lý đóng dialog đặt hàng
  const handleCloseOrderDialog = () => {
    setOrderDialogOpen(false);
  };

  // Xử lý thay đổi form đặt hàng
  const handleOrderFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setOrderForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Xử lý thay đổi phương thức thanh toán
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setOrderForm((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  // Xử lý tạo đơn hàng
  const handleCreateOrder = async () => {
    setOrderLoading(true);
    try {
      const result = await createOrder({
        ...orderForm,
        items: cart.items,
        totalAmount: cart.totalAmount,
        discount: cart.discount,
      });

      if (result.success) {
        showSnackbar("Đặt hàng thành công!", "success");
        setOrderDialogOpen(false);
        // Xóa giỏ hàng sau khi đặt hàng thành công
        const updatedCart = clearCart();
        setCart(updatedCart);
      } else {
        showSnackbar(result.message || "Đặt hàng thất bại!", "error");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showSnackbar("Đã xảy ra lỗi khi đặt hàng!", "error");
    } finally {
      setOrderLoading(false);
    }
  };

  // Hiển thị thông báo
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Đóng thông báo
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Định dạng giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Lấy icon cho danh mục
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cà Phê Việt Nam":
      case "Cà Phê Máy":
      case "Cold Brew":
        return <LocalCafeIcon />;
      case "Trà":
      case "Trà Sữa":
      case "CloudTea":
      case "Hi-Tea":
        return <LocalBarIcon />;
      case "Bánh ngọt":
        return <CakeIcon />;
      case "Bánh mặn":
      case "Snack":
        return <FastfoodIcon />;
      default:
        return <RestaurantIcon />;
    }
  };

  return (
    <Layout>
      <div className="pos-container">
        {/* Phần menu món ăn */}
        <div className="pos-menu-section">
          {/* Thanh tìm kiếm */}
          <div className="pos-search-bar">
            <TextField
              fullWidth
              placeholder="Tìm kiếm món ăn..."
              variant="outlined"
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
          </div>

          {/* Danh mục món ăn */}
          <div className="pos-categories">
            {foodCategories.map((category) => (
              <Button
                key={category}
                variant="outlined"
                className={`pos-category-button ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
                startIcon={getCategoryIcon(category)}>
                {category}
              </Button>
            ))}
          </div>

          {/* Danh sách món ăn */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : filteredFoods.length === 0 ? (
            <Typography align="center" sx={{ p: 3 }}>
              Không tìm thấy món ăn nào. Vui lòng thử lại sau.
            </Typography>
          ) : (
            <div className="pos-food-grid">
              {filteredFoods.map((food) => (
                <Card
                  key={food.id}
                  className="pos-food-card"
                  onClick={() => handleAddToCart(food)}>
                  <CardMedia
                    component="img"
                    className="pos-food-image"
                    image={
                      food.image ||
                      "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={food.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                  <CardContent className="pos-food-content">
                    <Typography variant="subtitle1" component="div" noWrap>
                      {food.name || "Không có tên"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {food.category || "Không phân loại"}
                    </Typography>
                    <Typography className="pos-food-price">
                      {formatPrice(food.price || 0)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Phần giỏ hàng */}
        <div className="pos-cart-section">
          <Typography variant="h6" gutterBottom>
            Giỏ hàng
            <IconButton
              color="error"
              onClick={handleClearCart}
              disabled={cart.items.length === 0}>
              <RestartAltIcon />
            </IconButton>
          </Typography>

          {cart.items.length === 0 ? (
            <div className="pos-empty-cart">
              <ShoppingCartIcon sx={{ fontSize: 60, color: "text.disabled" }} />
              <Typography variant="body1" color="text.secondary">
                Giỏ hàng trống
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vui lòng chọn món ăn để thêm vào giỏ hàng
              </Typography>
            </div>
          ) : (
            <div className="pos-cart-items">
              {cart.items.map((item) => (
                <div key={item.id} className="pos-cart-item">
                  <div className="pos-cart-item-info">
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(item.price)} x {item.quantity}
                    </Typography>
                  </div>
                  <div className="pos-cart-item-actions">
                    <Typography
                      variant="body1"
                      className="pos-cart-item-subtotal">
                      {formatPrice(item.subtotal)}
                    </Typography>
                    <div className="pos-cart-item-quantity">
                      <IconButton
                        size="small"
                        onClick={() => handleDecreaseQuantity(item.id)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2">{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleIncreaseQuantity(item.id)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </div>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFromCart(item.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Divider sx={{ my: 2 }} />

          <div className="pos-cart-summary">
            <div className="pos-cart-summary-row">
              <Typography variant="body1">Tạm tính</Typography>
              <Typography variant="body1">
                {formatPrice(cart.subtotal)}
              </Typography>
            </div>
            <div className="pos-cart-summary-row">
              <Typography variant="body1">Giảm giá</Typography>
              <TextField
                type="number"
                size="small"
                value={cart.discount}
                onChange={handleDiscountChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VND</InputAdornment>
                  ),
                }}
                sx={{ width: "120px" }}
              />
            </div>
            <div className="pos-cart-summary-row">
              <Typography variant="h6">Tổng cộng</Typography>
              <Typography variant="h6" color="primary">
                {formatPrice(cart.totalAmount)}
              </Typography>
            </div>
          </div>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<ReceiptIcon />}
            onClick={handleOpenOrderDialog}
            disabled={cart.items.length === 0}
            sx={{ mt: 2 }}>
            Đặt hàng
          </Button>
        </div>
      </div>

      {/* Dialog đặt hàng */}
      <Dialog
        open={orderDialogOpen}
        onClose={handleCloseOrderDialog}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Thông tin đặt hàng</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên khách hàng"
            type="text"
            fullWidth
            name="customerName"
            value={orderForm.customerName}
            onChange={handleOrderFormChange}
          />
          <TextField
            margin="dense"
            label="Số điện thoại"
            type="tel"
            fullWidth
            name="customerPhone"
            value={orderForm.customerPhone}
            onChange={handleOrderFormChange}
          />
          <TextField
            margin="dense"
            label="Ghi chú"
            type="text"
            fullWidth
            multiline
            rows={2}
            name="note"
            value={orderForm.note}
            onChange={handleOrderFormChange}
          />

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Phương thức thanh toán
          </Typography>
          <div className="pos-payment-methods">
            <Button
              variant={
                orderForm.paymentMethod === "CASH" ? "contained" : "outlined"
              }
              onClick={() => handlePaymentMethodChange("CASH")}
              sx={{ mr: 1 }}>
              Tiền mặt
            </Button>
            <Button
              variant={
                orderForm.paymentMethod === "CARD" ? "contained" : "outlined"
              }
              onClick={() => handlePaymentMethodChange("CARD")}
              sx={{ mr: 1 }}>
              Thẻ
            </Button>
            <Button
              variant={
                orderForm.paymentMethod === "MOMO" ? "contained" : "outlined"
              }
              onClick={() => handlePaymentMethodChange("MOMO")}
              sx={{ mr: 1 }}>
              MoMo
            </Button>
            <Button
              variant={
                orderForm.paymentMethod === "TRANSFER"
                  ? "contained"
                  : "outlined"
              }
              onClick={() => handlePaymentMethodChange("TRANSFER")}>
              Chuyển khoản
            </Button>
          </div>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Tóm tắt đơn hàng
          </Typography>
          <div className="pos-order-summary">
            {cart.items.map((item) => (
              <div key={item.id} className="pos-order-item">
                <Typography variant="body2">
                  {item.name} x {item.quantity}
                </Typography>
                <Typography variant="body2">
                  {formatPrice(item.subtotal)}
                </Typography>
              </div>
            ))}
            <Divider sx={{ my: 1 }} />
            <div className="pos-order-total">
              <Typography variant="subtitle2">Tạm tính</Typography>
              <Typography variant="subtitle2">
                {formatPrice(cart.subtotal)}
              </Typography>
            </div>
            <div className="pos-order-total">
              <Typography variant="subtitle2">Giảm giá</Typography>
              <Typography variant="subtitle2">
                {formatPrice(cart.discount)}
              </Typography>
            </div>
            <div className="pos-order-total">
              <Typography variant="subtitle1">Tổng cộng</Typography>
              <Typography variant="subtitle1" color="primary">
                {formatPrice(cart.totalAmount)}
              </Typography>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog}>Hủy</Button>
          <Button
            onClick={handleCreateOrder}
            variant="contained"
            color="primary"
            disabled={orderLoading}>
            {orderLoading ? <CircularProgress size={24} /> : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default POS;

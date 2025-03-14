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
  createOrderFromCart,
} from "../../services/cartService";
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

  // State cho dialog thanh toán
  const [openOrderDialog, setOpenOrderDialog] = useState<boolean>(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: "",
    customerPhone: "",
    paymentMethod: "CASH",
    note: "",
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
    showSnackbar(`Đã thêm ${food.name} vào giỏ hàng`, "success");
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
    if (item && item.quantity > 1) {
      const updatedCart = updateCartItemQuantity(itemId, item.quantity - 1);
      setCart(updatedCart);
    } else if (item && item.quantity === 1) {
      handleRemoveFromCart(itemId);
    }
  };

  // Xử lý xóa món khỏi giỏ hàng
  const handleRemoveFromCart = (itemId: string) => {
    const updatedCart = removeFromCart(itemId);
    setCart(updatedCart);
  };

  // Xử lý xóa toàn bộ giỏ hàng
  const handleClearCart = () => {
    const updatedCart = clearCart();
    setCart(updatedCart);
    showSnackbar("Đã xóa toàn bộ giỏ hàng", "success");
  };

  // Xử lý thay đổi giảm giá
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = parseFloat(e.target.value) || 0;
    const updatedCart = updateDiscount(discount);
    setCart(updatedCart);
  };

  // Mở dialog thanh toán
  const handleOpenOrderDialog = () => {
    if (cart.items.length === 0) {
      showSnackbar("Giỏ hàng trống, vui lòng thêm món ăn", "error");
      return;
    }
    setOpenOrderDialog(true);
  };

  // Đóng dialog thanh toán
  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
  };

  // Xử lý thay đổi form thanh toán
  const handleOrderFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name as string]: value,
    });
  };

  // Xử lý chọn phương thức thanh toán
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setOrderForm({
      ...orderForm,
      paymentMethod: method,
    });
  };

  // Xử lý tạo đơn hàng
  const handleCreateOrder = async () => {
    setOrderLoading(true);
    try {
      const response = await createOrderFromCart({
        ...orderForm,
        items: cart.items,
      });

      if (response.success) {
        // Tạo và tải xuống hóa đơn PDF
        await generateCartPDF(cart, orderForm, response.data.orderNumber);

        // Xóa giỏ hàng sau khi tạo đơn hàng thành công
        const updatedCart = clearCart();
        setCart(updatedCart);

        // Đóng dialog và hiển thị thông báo thành công
        setOpenOrderDialog(false);
        showSnackbar("Đơn hàng đã được tạo thành công", "success");

        // Reset form
        setOrderForm({
          customerName: "",
          customerPhone: "",
          paymentMethod: "CASH",
          note: "",
        });
      } else {
        showSnackbar(response.message || "Không thể tạo đơn hàng", "error");
      }
    } catch (error) {
      showSnackbar("Đã xảy ra lỗi khi tạo đơn hàng", "error");
      console.error("Error creating order:", error);
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
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Lấy icon cho danh mục
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cà Phê Việt Nam":
      case "Cà Phê Máy":
        return <LocalCafeIcon />;
      case "Trà":
      case "Trà Trái Cây":
        return <LocalBarIcon />;
      case "Bánh Ngọt":
        return <CakeIcon />;
      case "Đồ Ăn Nhẹ":
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
                    image={food.image}
                    alt={food.name}
                  />
                  <CardContent className="pos-food-content">
                    <Typography variant="subtitle1" component="div" noWrap>
                      {food.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {food.category}
                    </Typography>
                    <Typography className="pos-food-price">
                      {formatPrice(food.price)}
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
              <ShoppingCartIcon className="pos-empty-cart-icon" />
              <Typography variant="body1">Giỏ hàng trống</Typography>
              <Typography variant="body2">
                Vui lòng chọn món ăn để thêm vào giỏ hàng
              </Typography>
            </div>
          ) : (
            <>
              <div className="pos-cart-items">
                {cart.items.map((item) => (
                  <div key={item.id} className="pos-cart-item">
                    <div className="pos-cart-item-details">
                      <Typography className="pos-cart-item-name">
                        {item.name}
                      </Typography>
                      <Typography className="pos-cart-item-price">
                        {formatPrice(item.price)} x {item.quantity} ={" "}
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </div>
                    <div className="pos-cart-item-actions">
                      <div className="pos-quantity-control">
                        <IconButton
                          size="small"
                          onClick={() => handleDecreaseQuantity(item.id)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <span className="pos-quantity">{item.quantity}</span>
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

              <div className="pos-cart-summary">
                <div className="pos-summary-row">
                  <Typography>Tổng tiền hàng:</Typography>
                  <Typography>{formatPrice(cart.totalAmount)}</Typography>
                </div>

                <div className="pos-summary-row">
                  <TextField
                    label="Giảm giá"
                    type="number"
                    size="small"
                    value={cart.discount || ""}
                    onChange={handleDiscountChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">VND</InputAdornment>
                      ),
                    }}
                  />
                  <Typography>{formatPrice(cart.discount || 0)}</Typography>
                </div>

                <Divider />

                <div className="pos-total-row">
                  <Typography>Tổng thanh toán:</Typography>
                  <Typography>{formatPrice(cart.finalAmount)}</Typography>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  className="pos-checkout-button"
                  onClick={handleOpenOrderDialog}
                  startIcon={<ReceiptIcon />}>
                  Thanh toán
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dialog thanh toán */}
      <Dialog open={openOrderDialog} onClose={handleCloseOrderDialog}>
        <DialogTitle>Hoàn tất đơn hàng</DialogTitle>
        <DialogContent className="pos-dialog-content">
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
            type="text"
            fullWidth
            name="customerPhone"
            value={orderForm.customerPhone}
            onChange={handleOrderFormChange}
          />

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Phương thức thanh toán
          </Typography>

          <div className="pos-payment-methods">
            <Button
              variant="outlined"
              className={`pos-payment-method-button ${
                orderForm.paymentMethod === "CASH" ? "active" : ""
              }`}
              onClick={() => handlePaymentMethodChange("CASH")}>
              Tiền mặt
            </Button>
            <Button
              variant="outlined"
              className={`pos-payment-method-button ${
                orderForm.paymentMethod === "CARD" ? "active" : ""
              }`}
              onClick={() => handlePaymentMethodChange("CARD")}>
              Thẻ
            </Button>
            <Button
              variant="outlined"
              className={`pos-payment-method-button ${
                orderForm.paymentMethod === "TRANSFER" ? "active" : ""
              }`}
              onClick={() => handlePaymentMethodChange("TRANSFER")}>
              Chuyển khoản
            </Button>
            <Button
              variant="outlined"
              className={`pos-payment-method-button ${
                orderForm.paymentMethod === "MOMO" ? "active" : ""
              }`}
              onClick={() => handlePaymentMethodChange("MOMO")}>
              MoMo
            </Button>
            <Button
              variant="outlined"
              className={`pos-payment-method-button ${
                orderForm.paymentMethod === "ZALOPAY" ? "active" : ""
              }`}
              onClick={() => handlePaymentMethodChange("ZALOPAY")}>
              ZaloPay
            </Button>
          </div>

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

          <Typography variant="h6" sx={{ mt: 2 }}>
            Tổng thanh toán: {formatPrice(cart.finalAmount)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog} disabled={orderLoading}>
            Hủy
          </Button>
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default POS;

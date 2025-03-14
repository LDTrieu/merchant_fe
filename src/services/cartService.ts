import { Cart, CartItem } from '../models/Cart';
import { Food } from '../models/Food';
import { createOrder } from './orderService';
import { Order, PaymentMethod } from '../models/Order';

// Khởi tạo giỏ hàng trống
const initialCart: Cart = {
  items: [],
  totalAmount: 0,
  discount: 0,
  tax: 0,
  finalAmount: 0
};

// Lưu trữ giỏ hàng hiện tại
let currentCart: Cart = { ...initialCart };

// Hàm thêm món ăn vào giỏ hàng
export const addToCart = (food: Food, quantity: number = 1, note?: string): Cart => {
  // Kiểm tra xem món ăn đã có trong giỏ hàng chưa
  const existingItemIndex = currentCart.items.findIndex(item => item.foodId === food.id);
  
  if (existingItemIndex !== -1) {
    // Nếu đã có, tăng số lượng
    currentCart.items[existingItemIndex].quantity += quantity;
  } else {
    // Nếu chưa có, thêm mới
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      foodId: food.id,
      foodName: food.name,
      price: food.price,
      quantity,
      note
    };
    currentCart.items.push(newItem);
  }
  
  // Cập nhật tổng tiền
  updateCartTotals();
  
  return { ...currentCart };
};

// Hàm cập nhật số lượng món ăn trong giỏ hàng
export const updateCartItemQuantity = (itemId: string, quantity: number): Cart => {
  const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    if (quantity <= 0) {
      // Nếu số lượng <= 0, xóa món ăn khỏi giỏ hàng
      currentCart.items.splice(itemIndex, 1);
    } else {
      // Cập nhật số lượng
      currentCart.items[itemIndex].quantity = quantity;
    }
    
    // Cập nhật tổng tiền
    updateCartTotals();
  }
  
  return { ...currentCart };
};

// Hàm xóa món ăn khỏi giỏ hàng
export const removeFromCart = (itemId: string): Cart => {
  const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    currentCart.items.splice(itemIndex, 1);
    
    // Cập nhật tổng tiền
    updateCartTotals();
  }
  
  return { ...currentCart };
};

// Hàm cập nhật ghi chú cho món ăn
export const updateCartItemNote = (itemId: string, note: string): Cart => {
  const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    currentCart.items[itemIndex].note = note;
  }
  
  return { ...currentCart };
};

// Hàm cập nhật giảm giá
export const updateDiscount = (discount: number): Cart => {
  currentCart.discount = discount;
  updateCartTotals();
  
  return { ...currentCart };
};

// Hàm cập nhật thuế
export const updateTax = (taxPercent: number): Cart => {
  // Tính thuế dựa trên phần trăm
  const taxAmount = (currentCart.totalAmount - currentCart.discount) * (taxPercent / 100);
  currentCart.tax = taxAmount;
  updateCartTotals();
  
  return { ...currentCart };
};

// Hàm lấy giỏ hàng hiện tại
export const getCart = (): Cart => {
  return { ...currentCart };
};

// Hàm xóa toàn bộ giỏ hàng
export const clearCart = (): Cart => {
  currentCart = { ...initialCart };
  return { ...currentCart };
};

// Hàm cập nhật tổng tiền
const updateCartTotals = (): void => {
  // Tính tổng tiền các món ăn
  const totalAmount = currentCart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  currentCart.totalAmount = totalAmount;
  
  // Tính tổng tiền cuối cùng
  currentCart.finalAmount = totalAmount - currentCart.discount + currentCart.tax;
};

// Hàm tạo đơn hàng từ giỏ hàng
export const createOrderFromCart = async (
  customerName: string,
  paymentMethod: PaymentMethod,
  customerPhone?: string,
  note?: string
): Promise<Order> => {
  // Chuyển đổi các mục trong giỏ hàng thành các mục đơn hàng
  const orderItems = currentCart.items.map(item => ({
    id: item.id,
    foodId: item.foodId,
    foodName: item.foodName,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
    note: item.note
  }));
  
  // Tạo đơn hàng mới
  const newOrder = await createOrder({
    customerName,
    customerPhone,
    items: orderItems,
    totalAmount: currentCart.finalAmount,
    status: 'PENDING',
    paymentMethod,
    paymentStatus: 'PENDING',
    note
  });
  
  // Xóa giỏ hàng sau khi tạo đơn hàng
  clearCart();
  
  return newOrder;
}; 
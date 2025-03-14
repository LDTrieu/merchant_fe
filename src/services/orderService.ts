import axios from 'axios';
import { Order, OrderFilter, OrderListResponse, OrderStatus, PaymentMethod, PaymentStatus } from '../models/Order';
import { API_URL } from '../config';

// Dữ liệu mẫu cho đơn hàng
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0987654321',
    items: [
      {
        id: '1',
        foodId: '1',
        foodName: 'The Coffee House Sữa Đá',
        quantity: 2,
        price: 39000,
        subtotal: 78000
      },
      {
        id: '2',
        foodId: '15',
        foodName: 'Mousse Tiramisu',
        quantity: 1,
        price: 35000,
        subtotal: 35000
      }
    ],
    totalAmount: 113000,
    status: 'COMPLETED',
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    createdAt: '2023-07-15T08:30:00Z',
    updatedAt: '2023-07-15T09:00:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD002',
    customerName: 'Trần Thị B',
    customerPhone: '0912345678',
    items: [
      {
        id: '3',
        foodId: '6',
        foodName: 'Americano Đá',
        quantity: 1,
        price: 49000,
        subtotal: 49000
      }
    ],
    totalAmount: 49000,
    status: 'PROCESSING',
    paymentMethod: 'MOMO',
    paymentStatus: 'PAID',
    createdAt: '2023-07-15T10:30:00Z',
    updatedAt: '2023-07-15T10:35:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD003',
    customerName: 'Lê Văn C',
    customerPhone: '0909123456',
    items: [
      {
        id: '4',
        foodId: '10',
        foodName: 'Hi-Tea Đào',
        quantity: 3,
        price: 49000,
        subtotal: 147000
      },
      {
        id: '5',
        foodId: '17',
        foodName: 'Chà Bông Phô Mai',
        quantity: 2,
        price: 39000,
        subtotal: 78000
      }
    ],
    totalAmount: 225000,
    status: 'PENDING',
    paymentMethod: 'TRANSFER',
    paymentStatus: 'PENDING',
    note: 'Giao nhanh nhé',
    createdAt: '2023-07-15T14:30:00Z',
    updatedAt: '2023-07-15T14:30:00Z'
  }
];

// Danh sách trạng thái đơn hàng
export const orderStatuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

// Danh sách phương thức thanh toán
export const paymentMethods: PaymentMethod[] = ['CASH', 'CARD', 'TRANSFER', 'MOMO', 'ZALOPAY'];

// Danh sách trạng thái thanh toán
export const paymentStatuses: PaymentStatus[] = ['PENDING', 'PAID', 'REFUNDED'];

// Hàm lấy danh sách đơn hàng với phân trang và lọc
export const getOrders = async (
  page: number = 1,
  limit: number = 10,
  filter: OrderFilter = {}
): Promise<OrderListResponse> => {
  try {
    // Trong môi trường thực tế, gọi API
    // const response = await axios.get(`${API_URL}/orders`, {
    //   params: {
    //     page,
    //     limit,
    //     ...filter
    //   }
    // });
    // return response.data;

    // Giả lập độ trễ của API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredOrders = [...mockOrders];
    
    // Áp dụng bộ lọc
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) || 
        order.customerName.toLowerCase().includes(searchLower) ||
        (order.customerPhone && order.customerPhone.includes(filter.search))
      );
    }
    
    if (filter.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filter.status);
    }
    
    if (filter.paymentMethod) {
      filteredOrders = filteredOrders.filter(order => order.paymentMethod === filter.paymentMethod);
    }
    
    if (filter.paymentStatus) {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === filter.paymentStatus);
    }
    
    if (filter.fromDate) {
      const fromDate = new Date(filter.fromDate);
      filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= fromDate);
    }
    
    if (filter.toDate) {
      const toDate = new Date(filter.toDate);
      filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) <= toDate);
    }
    
    // Tính toán phân trang
    const total = filteredOrders.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    return {
      data: paginatedOrders,
      total,
      page,
      limit
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Hàm lấy thông tin chi tiết đơn hàng theo ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    // Trong môi trường thực tế, gọi API
    // const response = await axios.get(`${API_URL}/orders/${id}`);
    // return response.data;

    // Giả lập độ trễ của API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const order = mockOrders.find(order => order.id === id);
    return order || null;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

// Hàm tạo đơn hàng mới
export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  try {
    // Trong môi trường thực tế, gọi API
    // const response = await axios.post(`${API_URL}/orders`, orderData);
    // return response.data;

    // API endpoint cho việc tạo đơn hàng trong môi trường thực tế sẽ là:
    // POST ${API_URL}/orders
    // với body là orderData

    // Giả lập độ trễ của API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD${Date.now().toString().slice(-6)}`,
      ...orderData,
      status: orderData.status || 'PENDING',
      paymentStatus: orderData.paymentStatus || 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Thêm vào danh sách mock
    mockOrders.unshift(newOrder);
    
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Hàm cập nhật thông tin đơn hàng
export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order | null> => {
  try {
    // Trong môi trường thực tế, gọi API
    // const response = await axios.put(`${API_URL}/orders/${id}`, orderData);
    // return response.data;

    // Giả lập độ trễ của API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;
    
    // Cập nhật thông tin đơn hàng
    const updatedOrder: Order = {
      ...mockOrders[orderIndex],
      ...orderData,
      updatedAt: new Date().toISOString()
    };
    
    // Trong thực tế, đây sẽ là API call để cập nhật đơn hàng
    mockOrders[orderIndex] = updatedOrder;
    
    return updatedOrder;
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

// Hàm xóa đơn hàng
export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    // Trong môi trường thực tế, gọi API
    // await axios.delete(`${API_URL}/orders/${id}`);
    // return true;

    // Giả lập độ trễ của API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    if (orderIndex === -1) return false;
    
    // Trong thực tế, đây sẽ là API call để xóa đơn hàng
    mockOrders.splice(orderIndex, 1);
    
    return true;
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw error;
  }
}; 
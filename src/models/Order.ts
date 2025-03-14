export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  discount?: number;
  tax?: number;
  finalAmount?: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  foodId: string;
  foodName: string;
  quantity: number;
  price: number;
  subtotal: number;
  note?: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'MOMO' | 'ZALOPAY';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface OrderFilter {
  search?: string;
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
} 
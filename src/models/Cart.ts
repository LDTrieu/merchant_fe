import { Food } from './Food';

export interface CartItem {
  id: string;
  foodId: string;
  foodName: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
}

export interface OrderForm {
  customerName: string;
  customerPhone?: string;
  paymentMethod: string;
  note?: string;
} 
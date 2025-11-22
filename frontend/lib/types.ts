export type Role = "ADMIN" | "USER";

export interface Category {
  id: number;
  name: string;
  description: string;
  image_url?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryInput {
  name: string;
  description: string;
  image_url?: string | null;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id?: number | null;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id?: number | null;
  image_url: string;
  is_active: boolean;
}

export interface CartSummary {
  cart: {
    id: number;
    user_id: number;
  };
  items: CartItem[];
  total: number;
  item_count: number;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price_at_time: number;
  created_at?: string;
  product?: Product;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  payment_method: string;
  created_at?: string;
  updated_at?: string;
}

export type PaymentMethod = "cash_on_delivery" | "card" | "bank_transfer";

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
  payment_method: PaymentMethod;
}

export interface SessionUser {
  email: string;
  admin: boolean;
}

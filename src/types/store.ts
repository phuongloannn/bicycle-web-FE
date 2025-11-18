// src/types/store.ts
// src/types/store.ts - Cập nhật Product interface
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  category: string;
  
  // Các field ảnh có thể có - THÊM TẤT CẢ
  image_url?: string;    // Có thể không tồn tại
  imageUrl?: string;     // Hoặc có thể là imageUrl
  image?: string;        // Hoặc image
  photo?: string;        // Hoặc photo
  photos?: string[];     // Hoặc photos array
  
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  order_date: string;
  status: string;
  totalAmount: number;
  orderNumber: string;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  is_paid: boolean;
  paid_at?: string;
  phone: string;
  email: string;
  customer_notes?: string;
  cancellation_reason?: string;
  completed_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}
export enum OrderStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Shipped = 'Shipped',
  Canceled = 'Canceled',
}

// Sản phẩm trong đơn hàng
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

// Khách hàng
export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Đơn hàng
export interface Order {
  id: number;
  orderNumber: string;
  customer_id: number;
  customer?: Customer;
  customerName?: string; // nếu bạn vẫn dùng order.customerName
  status: OrderStatus;
  shippingAddress?: string;
  billingAddress?: string;
  isPaid?: boolean;
  paidAt?: string;
  paymentMethod?: string;
  items?: OrderItem[];
  totalAmount?: number;
}

// Request tạo đơn hàng
export interface CreateOrderRequest {
  customer_id: number;
  status: OrderStatus;
  shippingAddress?: string;
  billingAddress?: string;
  isPaid?: boolean;
  paidAt?: string;
  orderNumber?: string;
  items?: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

// Request cập nhật đơn hàng
export interface UpdateOrderRequest {
  status?: OrderStatus;
  shippingAddress?: string;
  billingAddress?: string;
  isPaid?: boolean;
  paidAt?: string;
}

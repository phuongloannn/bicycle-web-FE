// Enum trạng thái đơn hàng đồng bộ với backend (OrderStatus trong entity)
export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  SHIPPED = 'Shipped',
  CANCELED = 'Canceled',
}

// Thống kê đơn hàng dùng cho dashboard / biểu đồ
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  // Backend trả về Record<OrderStatus, number> nhưng để linh hoạt ta dùng string key
  statusDistribution: Record<string, number>;
  timeframe: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number | string; // ✅ THÊM | string
  totalPrice: number | string; // ✅ THÊM | string
  productImage?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number | string; // ✅ THÊM | string
  status: OrderStatus;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  isPaid: boolean;
  paidAt: string | null;
  customerNotes?: string;
  cancellationReason?: string;
  completedAt?: string;
  cancelledAt?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  customerId: number;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: string;
  totalAmount?: number;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  shippingAddress?: string;
  billingAddress?: string;
  isPaid?: boolean;
  paidAt?: string;
}
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface OrderItem {
    customerId?: number; // ✅ Thêm optional

  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  isPaid: boolean;
  paidAt: string | null;
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
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  shippingAddress?: string;
  billingAddress?: string;
  isPaid?: boolean;
  paidAt?: string;
}
// src/services/orderService.ts
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderStatus,
  OrderStats,
} from '@/types/order';
import { apiClient } from '@/lib/api/client';

export const orderService = {
  // Lấy tất cả orders
  async getAllOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/orders');
  },

  // Lấy order theo ID
  async getOrderById(id: number): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  // Lấy orders theo status
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return apiClient.get<Order[]>(`/orders/status/${status}`);
  },

  // Tạo order mới - SỬA ĐỂ LINH HOẠT VỚI GUEST CHECKOUT
  async createOrder(orderData: CreateOrderRequest | any): Promise<Order> {
    return apiClient.post<Order>('/orders', orderData);
  },

  // Cập nhật order
  async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}`, orderData);
  },

  // Xóa order
  async deleteOrder(id: number): Promise<void> {
    await apiClient.delete(`/orders/${id}`);
  },

  // Thống kê đơn hàng cho dashboard (bao gồm phân bố trạng thái)
  async getOrderStats(): Promise<OrderStats> {
    return apiClient.get<OrderStats>('/orders/stats');
  },
};
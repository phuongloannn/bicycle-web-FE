// src/services/orderService.ts
import axios from 'axios';
import { Order, CreateOrderRequest, UpdateOrderRequest, OrderStatus } from '@/types/order';

const API_BASE = 'http://localhost:3000';

export const orderService = {
  // Lấy tất cả orders
  async getAllOrders(): Promise<Order[]> {
    const response = await axios.get(`${API_BASE}/orders`);
    return response.data;
  },

  // Lấy order theo ID
  async getOrderById(id: number): Promise<Order> {
    const response = await axios.get(`${API_BASE}/orders/${id}`);
    return response.data;
  },

  // Lấy orders theo status
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const response = await axios.get(`${API_BASE}/orders/status/${status}`);
    return response.data;
  },

  // Tạo order mới - SỬA ĐỂ LINH HOẠT VỚI GUEST CHECKOUT
  async createOrder(orderData: CreateOrderRequest | any): Promise<Order> {
    const response = await axios.post(`${API_BASE}/orders`, orderData);
    return response.data;
  },

  // Cập nhật order
  async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<Order> {
    const response = await axios.patch(`${API_BASE}/orders/${id}`, orderData);
    return response.data;
  },

  // Xóa order
  async deleteOrder(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/orders/${id}`);
  },
};
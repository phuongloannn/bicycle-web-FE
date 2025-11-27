import axios from 'axios';
import { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  OrderStatus 
} from '@/types/order';

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

  // Tạo order mới
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await axios.post(`${API_BASE}/orders`, orderData, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  },

  // ✅ Cập nhật order (chỉ gửi đúng các trường backend cho phép)
  async updateOrder(orderId: number, data: UpdateOrderRequest): Promise<Order> {
    try {
      const response = await axios.patch(
        `${API_BASE}/orders/${orderId}`,
        {
          status: data.status,                       // enum: 'Pending' | 'Paid' | 'Shipped' | 'Canceled'
          shippingAddress: data.shippingAddress,     // string
          billingAddress: data.billingAddress,       // string
          isPaid: data.isPaid,                       // boolean
          paidAt: data.paidAt                        // ISO string → Date
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Lỗi cập nhật đơn hàng:", JSON.stringify(error.response.data, null, 2));
      } else {
        console.error("Lỗi cập nhật đơn hàng:", error.message);
      }
      throw error;
    }
  },

  // Xóa order
  async deleteOrder(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/orders/${id}`);
  }
};

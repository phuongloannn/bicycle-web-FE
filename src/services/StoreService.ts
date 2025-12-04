// src/services/StoreService.ts - UPDATED
import { productsApi, type Product } from '@/lib/api/products';

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

export class StoreService {
  async getProducts(search?: string): Promise<Product[]> {
    try {
      console.log('🔄 [StoreService] Fetching products...');
      
      const products = search
  ? await productsApi.search(search)
  : await productsApi.getAll();

      
      console.log('✅ [StoreService] Products received:', products.length);
      
      return products.map(product => this.transformProduct(product));
      
    } catch (error) {
      console.error('💥 [StoreService] Failed to fetch products:', error);
      throw new Error('Không thể tải danh sách sản phẩm');
    }
  }

  async getProduct(id: number): Promise<Product> {
    try {
      const product = await productsApi.getById(id);
      return this.transformProduct(product);
    } catch (error) {
      console.error('💥 [StoreService] Failed to fetch product:', error);
      throw new Error('Không thể tải thông tin sản phẩm');
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.getProducts(query);
  }

  async createOrder(orderData: any): Promise<Order> {
    // Giữ nguyên logic cũ
    const API_BASE_URL = '/api';
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  }

  async createCustomer(customerData: any): Promise<Customer> {
    // Giữ nguyên logic cũ  
    const API_BASE_URL = '/api';
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error('Failed to create customer');
    return response.json();
  }

  async getCategories(): Promise<string[]> {
    try {
      // Sử dụng API categories từ backend thay vì extract từ products
      const { getCategories } = await import('@/lib/api/categories');
      const categories = await getCategories();
      // Chỉ lấy các category đang active
      return categories
        .filter(cat => cat.is_active)
        .map(cat => cat.name)
        .filter(name => name && name.trim() !== '');
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback: extract từ products nếu API lỗi
      try {
        const products = await this.getProducts();
        const categories = [...new Set(products.map(product => product.category))];
        return categories.filter(category => category && category.trim() !== '');
      } catch (fallbackError) {
        console.error('Failed to extract categories from products:', fallbackError);
        return [];
      }
    }
  }

  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => 
      product.category.toLowerCase() === categoryName.toLowerCase()
    );
  }

  private transformProduct(product: Product): Product {
    return {
      ...product,
      stock: product.stock || product.quantity || 0,
      quantity: product.quantity || product.stock || 0
    };
  }
}

export const storeService = new StoreService();

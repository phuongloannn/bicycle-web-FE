// src/app/api/data.ts
// ✅ Sử dụng biến global để dữ liệu giỏ hàng không bị reset theo module
const globalForCart = globalThis as any;

if (!globalForCart.guestCarts) {
  globalForCart.guestCarts = {};
}

// Định nghĩa interfaces
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
}

export interface GuestCart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export const guestCarts: Record<string, GuestCart> = globalForCart.guestCarts;
// src/app/store/cart/page.tsx
'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { log } from 'console';

// 🔹 Định nghĩa type cho cart item
type CartItem = {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  image?: string; // backend trả về image URL
  product?: {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    stock: number;
    category: string;
    image_url?: string;
    imageUrl?: string;
    image?: string;
    photo?: string;
    photos?: string[];
    createdAt: string;
    updatedAt: string;
  };
};

export default function CartPage() {
  const { state, updateCartItem, removeFromCart, getCart } = useCart();
  const cartItems: CartItem[] = state.items;

  useEffect(() => {
    getCart(); // Lấy giỏ hàng từ CartContext
  }, []);

  // 🔹 Hàm xử lý URL ảnh
  const getImageUrl = (item: CartItem) => {
  if (!item.image) return '/no-image.png'; // ảnh mặc định nếu không có ảnh
  return item.image.startsWith('http')
    ? item.image
    : `http://localhost:3000/uploads/${item.image}`;
};


  // 🔹 Update quantity
  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(cartItemId, newQuantity);
  };

  // 🔹 Remove item
  const handleRemoveItem = async (cartItemId: number) => {
    await removeFromCart(cartItemId);
  };

  // 🔹 Tổng tiền
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link
            href="/store/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                
                {/* ẢNH SẢN PHẨM */}
              
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(item)}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />

                </div>

                {/* THÔNG TIN SẢN PHẨM */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product?.name || item.productName}</h3>
                  <p className="text-gray-600">{item.price.toLocaleString('vi-VN')} đ</p>

                  {/* Số lượng */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tổng + Xóa */}
                <div className="text-right space-y-2">
                  <p className="font-semibold">{item.total.toLocaleString('vi-VN')} đ</p>
                  <button
                    className="text-red-600 hover:text-red-800 text-sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>30.000 đ</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{(getTotalPrice() + 30000).toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <Link
              href="/store/checkout"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-center block hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

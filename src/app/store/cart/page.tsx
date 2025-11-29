// src/app/store/cart/page.tsx
'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

// 🔹 Định nghĩa type cho cart item
type CartItem = {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  image?: string; // backend trả về image URL
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

  // 🔹 Update số lượng
  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(cartItemId, newQuantity);
  };

  // 🔹 Xóa item
  const handleRemoveItem = async (cartItemId: number) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      await removeFromCart(cartItemId);
    }
  };

  // 🔹 Tổng tiền
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ Hàng</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Giỏ hàng của bạn đang trống</p>
          <Link
            href="/store/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Tiếp Tục Mua Sắm
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
                  <h3 className="font-semibold text-lg">{item.productName}</h3>
                  <p className="text-gray-600">{item.price.toLocaleString('vi-VN')} ₫</p>

                  {/* Số lượng */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border border-gray-300 rounded min-w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tổng + Xóa */}
                <div className="text-right space-y-2">
                  <p className="font-semibold text-lg text-green-600">
                    {item.total.toLocaleString('vi-VN')} ₫
                  </p>
                  <button
                    className="text-red-600 hover:text-red-800 text-sm transition-colors"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-xl font-bold mb-4">Tóm Tắt Đơn Hàng</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>30.000 ₫</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg text-green-600">
                  <span>Tổng cộng</span>
                  <span>{(getTotalPrice() + 30000).toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            </div>

            <Link
              href="/store/checkout"
              className="w-full bg-green-600 text-white py-3 rounded-lg text-center block hover:bg-green-700 transition-colors font-semibold"
            >
              Tiến Hành Thanh Toán
            </Link>

            <Link
              href="/store/products"
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg text-center block hover:bg-gray-300 transition-colors font-semibold mt-3"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
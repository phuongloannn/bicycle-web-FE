// src/app/store/checkout/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  notes: string;
}

export default function CheckoutPage() {
  const { state, clearCart, getCart } = useCart();
  
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    email: '',
    phone: '',
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: 'COD',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    if (state.items.length === 0 && !orderSuccess) {
      window.location.href = '/store/cart';
    }
  }, [state.items, orderSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sessionId = localStorage.getItem('cartSessionId');
      const token = localStorage.getItem('token');

      console.log('[Checkout] LocalStorage check:', {
        sessionId,
        hasToken: !!token
      });

      // ✅ FIX QUAN TRỌNG: Đảm bảo luôn có sessionId
      if (!sessionId) {
        alert('Lỗi: Không tìm thấy session giỏ hàng. Vui lòng thêm sản phẩm vào giỏ trước.');
        setLoading(false);
        return;
      }

     

      // ✅ QUAN TRỌNG: Chỉ gửi thông tin form
      const checkoutData = {
        ...form,
        billingAddress: form.billingAddress || form.shippingAddress
      };

      console.log('[Checkout] Sending checkout request:', {
        hasToken: !!token,
        hasSessionId: !!sessionId,
        sessionId: sessionId, // ✅ LOG sessionId để debug
        customer: form.name,
        itemsInState: state.items.length // ✅ LOG số items trong state
      });

      const response = await fetch('/api/cart/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Session-ID': sessionId,
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(checkoutData)
});

      console.log('[Checkout] Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('[Checkout] Success:', result);
        
        setOrderData(result.data);
        setOrderSuccess(true);
        await clearCart();
        
        // ✅ Giữ lại sessionId để tiếp tục mua hàng
        // KHÔNG xóa sessionId vì user có thể muốn tiếp tục mua hàng
        
      } else {
        const errorResult = await response.json();
        console.error('[Checkout] Error:', errorResult);
        
        // ✅ Hiển thị lỗi chi tiết hơn
        if (errorResult.error === 'Cart is empty') {
          alert('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ trước khi đặt hàng.');
        } else {
          alert(errorResult.error || errorResult.message || 'Có lỗi xảy ra khi đặt hàng');
        }
      }
    } catch (error) {
      console.error('[Checkout] Exception:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess && orderData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <h2 className="text-2xl font-bold mb-2">Đặt Hàng Thành Công!</h2>
            <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-left">
            <h3 className="text-xl font-bold mb-4">Thông Tin Đơn Hàng</h3>
            <div className="space-y-2">
              <p><strong>Mã đơn hàng:</strong> {orderData.orderNumber || orderData.id || 'N/A'}</p>
              <p><strong>Khách hàng:</strong> {orderData.customerName || form.name}</p>
              <p><strong>Email:</strong> {orderData.customerEmail || form.email}</p>
              <p><strong>Số điện thoại:</strong> {orderData.customerPhone || form.phone}</p>
              <p><strong>Tổng tiền:</strong> ${Number(orderData.totalAmount || 0)?.toFixed(2)}</p>
              <p><strong>Phương thức thanh toán:</strong> {orderData.paymentMethod || form.paymentMethod}</p>
              <p><strong>Địa chỉ giao hàng:</strong> {orderData.shippingAddress || form.shippingAddress}</p>
              <p><strong>Trạng thái:</strong> {orderData.status || 'Đang xử lý'}</p>
            </div>
          </div>

          <div className="space-x-4">
            <Link 
              href="/store/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Tiếp Tục Mua Sắm
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              In Hóa Đơn
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh Toán</h1>

      {state.items.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Giỏ hàng trống</p>
          <Link 
            href="/store/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Quay Lại Mua Sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Thông Tin Giao Hàng</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập họ và tên đầy đủ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng *</label>
                <textarea
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ thanh toán</label>
                <textarea
                  name="billingAddress"
                  value={form.billingAddress}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Nếu giống địa chỉ giao hàng, để trống"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phương thức thanh toán</label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="BANKING">Chuyển khoản ngân hàng</option>
                  <option value="CREDIT_CARD">Thẻ tín dụng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ghi chú đơn hàng</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ghi chú về đơn hàng, thời gian giao hàng, ..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || state.items.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-semibold"
              >
                {loading ? 'Đang xử lý...' : `Đặt Hàng - $${(state.total > 100 ? state.total : state.total + 10).toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
            <h3 className="text-xl font-bold mb-4">Đơn Hàng Của Bạn</h3>
            
            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b pb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}/sản phẩm</p>
                  </div>
                  <p className="font-semibold text-gray-900">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>$10.00</span>
              </div>
              {state.total > 100 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá (đơn hàng &gt; $100):</span>
                  <span>-$10.00</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2 text-gray-900">
                <span>Tổng cộng:</span>
                <span>${(state.total > 100 ? state.total : state.total + 10).toFixed(2)}</span>
              </div>
            </div>

            {/* Debug Info - Chỉ hiển thị trong development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>SessionId: {localStorage.getItem('cartSessionId') || 'Not found'}</p>
                <p>Token: {localStorage.getItem('token') ? 'Exists' : 'Not found'}</p>
                <p>Items in cart: {state.items.length}</p>
              </div>
            )}

            {/* Security Badges */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span>Bảo mật</span>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <span>Đảm bảo</span>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">✓</span>
                  </div>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
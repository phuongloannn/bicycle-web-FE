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
  const { state, checkout, clearCart, getCart } = useCart();
  
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
  // ✅ CHỈ redirect khi thực sự cần
  if (state.items.length === 0 && !orderSuccess && !loading) {
    console.log('🔄 Redirecting to cart because: empty cart, no success, not loading');
    window.location.href = '/store/cart';
  }
}, [state.items, orderSuccess, loading]);

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
      console.log('💰 [Checkout] Starting LOCAL checkout process');

      // VALIDATION
      if (state.items.length === 0) {
        alert('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ trước.');
        setLoading(false);
        return;
      }

      if (!form.name || !form.email || !form.phone || !form.shippingAddress) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc (tên, email, số điện thoại, địa chỉ giao hàng)');
        setLoading(false);
        return;
      }

      // ✅ SỬ DỤNG CART CONTEXT CHECKOUT (LOCAL)
      const result = await checkout({
        ...form,
        billingAddress: form.billingAddress || form.shippingAddress
      });

      console.log('✅ [Checkout] LOCAL checkout success:', result);
      
      setOrderData(result.order);
      setOrderSuccess(true);
      
    } catch (error: any) {
      console.error('❌ [Checkout] LOCAL checkout error:', error);
      alert(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ HELPER FUNCTION ĐỂ ĐẢM BẢO SỐ
  const formatCurrency = (value: any): string => {
    const num = Number(value);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  // ✅ TÍNH TOÁN TỔNG TIỀN
  const calculateTotals = () => {
    const subtotal = Number(state.total) || 0;
    const shippingFee = subtotal > 100 ? 0 : 10;
    const discount = subtotal > 100 ? 10 : 0;
    const total = subtotal + shippingFee - discount;
    
    return { subtotal, shippingFee, discount, total };
  };

  const { subtotal, shippingFee, discount, total } = calculateTotals();

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
              <p><strong>Mã đơn hàng:</strong> {orderData.id || 'N/A'}</p>
              <p><strong>Khách hàng:</strong> {orderData.customerInfo?.name || form.name}</p>
              <p><strong>Email:</strong> {orderData.customerInfo?.email || form.email}</p>
              <p><strong>Số điện thoại:</strong> {orderData.customerInfo?.phone || form.phone}</p>
              <p><strong>Tổng tiền:</strong> {formatCurrency(orderData.total)}</p>
              <p><strong>Phương thức thanh toán:</strong> {orderData.customerInfo?.paymentMethod || form.paymentMethod}</p>
              <p><strong>Địa chỉ giao hàng:</strong> {orderData.customerInfo?.shippingAddress || form.shippingAddress}</p>
              <p><strong>Trạng thái:</strong> {orderData.status || 'Đang xử lý'}</p>
              <p><strong>Ngày đặt:</strong> {new Date(orderData.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-left">
            <h3 className="text-xl font-bold mb-4">Chi Tiết Đơn Hàng</h3>
            <div className="space-y-3">
              {orderData.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.total)}</p>
                </div>
              ))}
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
                {loading ? 'Đang xử lý...' : `Đặt Hàng - ${formatCurrency(total)}`}
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
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)}/sản phẩm</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá (đơn hàng &gt; $100):</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2 text-gray-900">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

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

            {/* Debug Info - Chỉ hiển thị trong development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>Items in cart: {state.items.length}</p>
                <p>Cart total: {state.total}</p>
                <p>Calculated total: {total}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
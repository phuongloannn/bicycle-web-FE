'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
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
  const { state, checkout, getCart } = useCart();
  const router = useRouter();

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

  useEffect(() => {
    getCart();
  }, [getCart]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (state.items.length === 0) {
        alert('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ trước.');
        return;
      }
      if (!form.name || !form.email || !form.phone || !form.shippingAddress) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
        return;
      }

      // Gọi checkout từ CartContext
      const result = await checkout({
        ...form,
        billingAddress: form.billingAddress || form.shippingAddress
      });

      const orderId = result.order?.id;
      const totalAmount = result.order?.totalAmount;

      // ✅ Điều hướng sang trang thanh toán tương ứng
 // ✅ Điều hướng sang trang thanh toán tương ứng
if (orderId) {
  switch (form.paymentMethod) {
    case 'BANKING':
      router.push(`/payment/bank-transfer/${orderId}?amount=${totalAmount}`);
      break;
    case 'CREDIT_CARD':
      router.push(`/payment/credit-card/${orderId}?amount=${totalAmount}`);
      break;
    case 'COD':
      // ✅ Với COD thì chuyển sang trang checkout success
router.push(`/payment/checkout_COD?orderId=${orderId}`);
      break;
    default:
      console.warn('Phương thức thanh toán không hợp lệ:', form.paymentMethod);
  }
}

    } catch (error: any) {
      console.error('❌ Checkout error:', error);
      alert(error.message || 'Có lỗi xảy ra khi đặt hàng.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: any): string => {
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(isNaN(num) ? 0 : num);
  };

  const subtotal = Number(state.total) || 0;
  const shippingFee = subtotal > 100 ? 0 : 10;
  const discount = subtotal > 100 ? 10 : 0;
  const total = subtotal + shippingFee - discount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh Toán</h1>

      {state.items.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Giỏ hàng trống</p>
          <Link href="/store/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Quay Lại Mua Sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" value={form.name} onChange={handleInputChange} required placeholder="Họ và tên" className="w-full p-2 border rounded" />
              <input name="email" value={form.email} onChange={handleInputChange} required placeholder="Email" className="w-full p-2 border rounded" />
              <input name="phone" value={form.phone} onChange={handleInputChange} required placeholder="Số điện thoại" className="w-full p-2 border rounded" />
              <textarea name="shippingAddress" value={form.shippingAddress} onChange={handleInputChange} required placeholder="Địa chỉ giao hàng" className="w-full p-2 border rounded" />
              <textarea name="billingAddress" value={form.billingAddress} onChange={handleInputChange} placeholder="Địa chỉ thanh toán" className="w-full p-2 border rounded" />
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleInputChange} className="w-full p-2 border rounded">
                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                <option value="BANKING">Chuyển khoản ngân hàng</option>
                <option value="CREDIT_CARD">Thẻ tín dụng</option>
              </select>
              <textarea name="notes" value={form.notes} onChange={handleInputChange} placeholder="Ghi chú đơn hàng" className="w-full p-2 border rounded" />
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg">
                {loading ? 'Đang xử lý...' : `Đặt Hàng - ${formatCurrency(total)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
            <h3 className="text-xl font-bold mb-4">Đơn Hàng Của Bạn</h3>
            {state.items.map(item => (
              <div key={item.id} className="flex justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm">Số lượng: {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.total)}</p>
              </div>
            ))}
            <div className="mt-4 space-y-2">
              <p>Tạm tính: {formatCurrency(subtotal)}</p>
              <p>Phí vận chuyển: {formatCurrency(shippingFee)}</p>
              {discount > 0 && <p>Giảm giá: -{formatCurrency(discount)}</p>}
              <p className="font-bold">Tổng cộng: {formatCurrency(total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

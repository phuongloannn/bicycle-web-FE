'use client';

import React, { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/types/order';

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /** 🟦 LOAD ORDER */
  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError('Không thể tải thông tin đơn hàng!');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  /** 🟦 FORMAT MONEY */
  const formatCurrency = (amount: number | undefined) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount ?? 0);

  /** 🟦 SUBMIT UPDATE */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      setSubmitting(true);
      setError('');

      await orderService.updateOrder(orderId, {
        status: order.status,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        isPaid: order.isPaid,
      });

      alert('✅ Cập nhật đơn hàng thành công!');
      router.push('/orders');
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật đơn hàng!');
    } finally {
      setSubmitting(false);
    }
  };

  /** 🟦 LOADING STATE */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <div>
          <div className="animate-spin h-16 w-16 rounded-full border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  /** 🟦 ORDER NOT FOUND */
  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Không tìm thấy đơn hàng!</h2>
          <p className="text-red-600 mb-4">
            {error || `Đơn hàng với ID ${orderId} không tồn tại.`}
          </p>
          <button
            onClick={() => router.push('/orders')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  /** 🟦 UI CHÍNH */
  return (
    <div className="p-6 max-w-5xl mx-auto">
      
      {/* BACK */}
      <button
        onClick={() => router.push('/orders')}
        className="text-blue-600 hover:text-blue-800 flex items-center mb-6"
      >
        ← Quay lại danh sách
      </button>

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-800">
        Chỉnh sửa đơn hàng #{order.orderNumber}
      </h1>
      <p className="text-gray-600 mt-2">
        Khách hàng: <span className="font-medium">{order.customerName}</span> (ID: {order.customer_id})
      </p>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-8 mt-6">
        
        {/* ORDER INFO */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái đơn hàng
              </label>
              <select
                value={order.status}
                onChange={(e) =>
                  setOrder({ ...order, status: e.target.value as OrderStatus })
                }
                className="w-full border border-gray-300 p-3 rounded-lg"
              >
                <option value={OrderStatus.Pending}>Pending</option>
                <option value={OrderStatus.Paid}>Đã thanh toán</option>
                <option value={OrderStatus.Shipped}>Đã giao hàng</option>
                <option value={OrderStatus.Canceled}>Đã hủy</option>
              </select>
            </div>

            {/* PAYMENT METHOD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương thức thanh toán
              </label>
              <input
                type="text"
                value={order.paymentMethod ?? ''}
                readOnly
                className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50"
              />
            </div>

          </div>

          {/* IS PAID */}
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="isPaid"
              checked={order.isPaid ?? false}
              onChange={(e) =>
                setOrder({ ...order, isPaid: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="isPaid" className="ml-2 text-sm text-gray-700">
              Đã thanh toán
            </label>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Địa chỉ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* SHIPPING */}
            <div>
              <label className="block text-sm font-medium mb-2">Địa chỉ giao hàng</label>
              <textarea
                rows={4}
                value={order.shippingAddress ?? ''}
                onChange={(e) =>
                  setOrder({ ...order, shippingAddress: e.target.value })
                }
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
            </div>

            {/* BILLING */}
            <div>
              <label className="block text-sm font-medium mb-2">Địa chỉ thanh toán</label>
              <textarea
                rows={4}
                value={order.billingAddress ?? ''}
                onChange={(e) =>
                  setOrder({ ...order, billingAddress: e.target.value })
                }
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
            </div>

          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm trong đơn hàng</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">

              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Số lượng</th>
                  <th className="px-4 py-3">Đơn giá</th>
                  <th className="px-4 py-3">Thành tiền</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {order.items?.map((item) => (
                  <tr key={item.id}>

                    <td className="px-4 py-3">
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm text-gray-500">ID: {item.product_id}</div>
                    </td>

                    <td className="px-4 py-3">{item.quantity}</td>

                    <td className="px-4 py-3">
                      {formatCurrency(item.price)}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(item.total)}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* TOTAL */}
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">
              Tổng cộng: {formatCurrency(order.totalAmount)}
            </p>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-6 border-t">

          <button
            type="button"
            onClick={() => router.push('/orders')}
            className="px-6 py-3 bg-gray-300 rounded-lg"
            disabled={submitting}
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            {submitting ? '⏳ Đang cập nhật...' : '💾 Lưu thay đổi'}
          </button>

        </div>
      </form>
    </div>
  );
}

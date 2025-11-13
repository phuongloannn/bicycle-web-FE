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

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(orderId);
        console.log('📦 Order loaded:', data);
        setOrder(data);
      } catch (error) {
        console.error('❌ Error loading order:', error);
        setError('Không thể tải thông tin đơn hàng!');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order) return;

    try {
      setSubmitting(true);
      setError('');
      
      console.log('📤 Updating order:', orderId, {
        status: order.status,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        isPaid: order.isPaid,
      });

      await orderService.updateOrder(orderId, {
        status: order.status,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        isPaid: order.isPaid,
      });
      
      alert('✅ Cập nhật đơn hàng thành công!');
      router.push('/orders');
    } catch (error) {
      console.error('❌ Error updating order:', error);
      setError('Có lỗi xảy ra khi cập nhật đơn hàng!');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push('/orders')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Quay lại danh sách
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Chỉnh sửa đơn hàng #{order.orderNumber}
        </h1>
        <p className="text-gray-600 mt-2">
          Khách hàng: {order.customerName} (ID: {order.customerId})
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin đơn hàng */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái đơn hàng *
              </label>
              <select
                value={order.status}
                onChange={(e) => setOrder({...order, status: e.target.value as OrderStatus})}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending - Chờ xác nhận</option>
                <option value="confirmed">Confirmed - Đã xác nhận</option>
                <option value="processing">Processing - Đang xử lý</option>
                <option value="shipped">Shipped - Đã giao hàng</option>
                <option value="delivered">Delivered - Đã giao</option>
                <option value="cancelled">Cancelled - Đã hủy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương thức thanh toán
              </label>
              <input
                type="text"
                value={order.paymentMethod}
                readOnly
                className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="isPaid"
              checked={order.isPaid}
              onChange={(e) => setOrder({...order, isPaid: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPaid" className="ml-2 text-sm font-medium text-gray-700">
              Đã thanh toán
            </label>
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Địa chỉ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ giao hàng
              </label>
              <textarea
                value={order.shippingAddress}
                onChange={(e) => setOrder({...order, shippingAddress: e.target.value})}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Nhập địa chỉ giao hàng..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ thanh toán
              </label>
              <textarea
                value={order.billingAddress}
                onChange={(e) => setOrder({...order, billingAddress: e.target.value})}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Nhập địa chỉ thanh toán..."
              />
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm (Read-only) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm trong đơn hàng</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Số lượng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Đơn giá
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-gray-500">ID: {item.productId}</div>
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="text-right">
              <p className="text-lg font-semibold">
                Tổng cộng: {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.push('/orders')}
            disabled={submitting}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Hủy
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '⏳ Đang cập nhật...' : '✅ Cập nhật đơn hàng'}
          </button>
        </div>
      </form>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { useRouter, useParams } from 'next/navigation';
import { Order, OrderStatus } from '@/types/order';

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
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
        setOrder(data);
      } catch {
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
      await orderService.updateOrder(orderId, {
        status: order.status,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        isPaid: order.isPaid,
      });
      alert('✅ Cập nhật đơn hàng thành công!');
      router.push('/orders');
    } catch {
      setError('Có lỗi xảy ra khi cập nhật đơn hàng!');
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F2D8EE]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B278C] mx-auto"></div>
          <p className="mt-4 text-[#8B278C] font-semibold">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 bg-[#F2D8EE] min-h-screen flex items-center justify-center">
        <div className="bg-[#D4ADD9] border border-[#B673BF] rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-[#8B278C] mb-2">Không tìm thấy đơn hàng!</h2>
          <p className="text-[#8B278C] mb-4">{error || `Đơn hàng với ID ${orderId} không tồn tại.`}</p>
          <button
            onClick={() => router.push('/orders')}
            className="px-6 py-2 bg-gradient-to-r from-[#8B278C] via-[#B673BF] to-[#D2A0D9] text-white rounded-lg hover:opacity-90 transition duration-200"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#F2D8EE] min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => router.push('/orders')}
          className="flex items-center text-[#8B278C] hover:text-[#B673BF] mb-4 font-semibold"
        >
          ← Quay lại danh sách
        </button>
        <h1 className="text-3xl font-bold text-[#8B278C]">
          Chỉnh sửa đơn hàng #{order.orderNumber}
        </h1>
        <p className="text-[#B673BF] mt-2">
          Khách hàng: {order.customerName} (ID: {order.customerId})
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-[#D4ADD9] border border-[#B673BF] text-[#8B278C] px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin đơn hàng */}
        <div className="bg-[#D2A0D9] p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#8B278C]">Thông tin đơn hàng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#8B278C] mb-2">
                Trạng thái đơn hàng *
              </label>
              <select
                value={order.status}
                onChange={(e) =>
                  setOrder({ ...order, status: e.target.value as OrderStatus })
                }
                className="w-full border border-[#B673BF] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-[#F2D8EE] text-[#8B278C]"
              >
                <option value={OrderStatus.PENDING}>Pending - Chờ xác nhận</option>
                <option value={OrderStatus.PAID}>Paid - Đã thanh toán</option>
                <option value={OrderStatus.SHIPPED}>Shipped - Đã giao hàng</option>
                <option value={OrderStatus.CANCELED}>Canceled - Đã hủy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B278C] mb-2">
                Phương thức thanh toán
              </label>
              <input
                type="text"
                value={order.paymentMethod}
                readOnly
                className="w-full border border-[#B673BF] p-3 rounded-lg bg-[#F2D8EE] text-[#8B278C]"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="isPaid"
              checked={order.isPaid}
              onChange={(e) => setOrder({...order, isPaid: e.target.checked})}
              className="w-4 h-4 text-[#8B278C] rounded focus:ring-[#8B278C]"
            />
            <label htmlFor="isPaid" className="ml-2 text-sm font-medium text-[#8B278C]">
              Đã thanh toán
            </label>
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="bg-[#D2A0D9] p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#8B278C]">Địa chỉ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#8B278C] mb-2">
                Địa chỉ giao hàng
              </label>
              <textarea
                value={order.shippingAddress}
                onChange={(e) => setOrder({...order, shippingAddress: e.target.value})}
                className="w-full border border-[#B673BF] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-[#F2D8EE] text-[#8B278C]"
                rows={4}
                placeholder="Nhập địa chỉ giao hàng..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B278C] mb-2">
                Địa chỉ thanh toán
              </label>
              <textarea
                value={order.billingAddress}
                onChange={(e) => setOrder({...order, billingAddress: e.target.value})}
                className="w-full border border-[#B673BF] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-[#F2D8EE] text-[#8B278C]"
                rows={4}
                placeholder="Nhập địa chỉ thanh toán..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-[#B673BF]">
          <button
            type="button"
            onClick={() => router.push('/orders')}
            disabled={submitting}
            className="px-6 py-3 bg-[#D4ADD9] text-[#8B278C] rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            Hủy
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-gradient-to-r from-[#8B278C] via-[#B673BF] to-[#D2A0D9] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '⏳ Đang cập nhật...' : '✅ Cập nhật đơn hàng'}
          </button>
        </div>
      </form>
    </div>
  );
}

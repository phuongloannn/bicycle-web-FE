import React from 'react';
import { Order } from '@/types/order';

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose }) => {
  const formatCurrency = (amount: number | string) => {
    // ✅ THÊM DÒNG NÀY - CHUYỂN SANG NUMBER
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numericAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Paid: 'bg-green-100 text-green-800',
      Shipped: 'bg-indigo-100 text-indigo-800',
      Canceled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Chi tiết đơn hàng: {order.orderNumber}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Thông tin đơn hàng</h3>
              <div className="space-y-2">
                <p><strong>Mã đơn:</strong> {order.orderNumber}</p>
                <p><strong>Khách hàng:</strong> {order.customerName} (ID: {order.customerId})</p>
                <p><strong>Trạng thái:</strong> 
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </p>
                <p><strong>Thanh toán:</strong> 
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </p>
                <p><strong>Phương thức:</strong> {order.paymentMethod}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Địa chỉ giao hàng</h3>
              <div className="space-y-2">
                <p><strong>Giao đến:</strong> {order.shippingAddress}</p>
                <p><strong>Hóa đơn:</strong> {order.billingAddress}</p>
                <p><strong>Ngày tạo:</strong> {formatDate(order.createdAt)}</p>
                <p><strong>Cập nhật:</strong> {formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Sản phẩm</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
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
          </div>

          {/* Order Summary */}
          <div className="flex justify-end">
            <div className="text-right space-y-2">
              <p className="text-lg">
                <strong>Tổng cộng: {formatCurrency(order.totalAmount)}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Đóng
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            In hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
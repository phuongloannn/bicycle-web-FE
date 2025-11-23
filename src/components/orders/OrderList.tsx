import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { orderService } from '@/services/orderService';
import { useRouter } from 'next/navigation';
import OrderDetail from './OrderDetail';

const OrderList: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let data: Order[];
      
      if (selectedStatus === 'all') {
        data = await orderService.getAllOrders();
      } else {
        data = await orderService.getOrdersByStatus(selectedStatus);
      }
      
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ THÊM: Handler xem chi tiết
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  // ✅ THÊM: Handler sửa order
  const handleEditOrder = (orderId: number) => {
    router.push(`/orders/${orderId}/edit`);
  };

  // ✅ THÊM: Handler xóa order
  const handleDeleteOrder = async (orderId: number, orderNumber: string) => {
    const confirmed = confirm(`Bạn có chắc muốn xóa đơn hàng ${orderNumber}?`);
    
    if (!confirmed) return;

    try {
      await orderService.deleteOrder(orderId);
      alert('Đã xóa đơn hàng thành công!');
      loadOrders(); // Reload danh sách
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Có lỗi xảy ra khi xóa đơn hàng!');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [OrderStatus.PROCESSING]: 'bg-purple-100 text-purple-800',
      [OrderStatus.SHIPPED]: 'bg-indigo-100 text-indigo-800',
      [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📦 Quản lý Đơn hàng</h1>
        <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value={OrderStatus.PENDING}>Chờ xác nhận</option>
          <option value={OrderStatus.CONFIRMED}>Đã xác nhận</option>
          <option value={OrderStatus.PROCESSING}>Đang xử lý</option>
          <option value={OrderStatus.SHIPPED}>Đã giao hàng</option>
          <option value={OrderStatus.DELIVERED}>Đã giao</option>
          <option value={OrderStatus.CANCELLED}>Đã hủy</option>
        </select>

        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">ID: {order.customerId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/* ✅ THÊM onClick handlers */}
                    <button 
                      onClick={() => handleViewOrder(order)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Xem chi tiết"
                    >
                      👁️ Xem
                    </button>
                    <button 
                      onClick={() => handleEditOrder(order.id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                      title="Chỉnh sửa"
                    >
                      ✏️ Sửa
                    </button>
                    <button 
                      onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                      className="text-red-600 hover:text-red-900"
                      title="Xóa đơn hàng"
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">Không có đơn hàng nào</p>
          </div>
        )}
      </div>

      {/* ✅ THÊM: Modal xem chi tiết */}
      {showDetail && selectedOrder && (
        <OrderDetail 
          order={selectedOrder} 
          onClose={() => {
            setShowDetail(false);
            setSelectedOrder(null);
          }} 
        />
      )}
    </div>
  );
};

export default OrderList;
'use client';

import React, { useState } from 'react';
import OrderList from '@/components/orders/OrderList';
import CreateOrder from '@/components/orders/CreateOrder';

export default function OrdersPage() {
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  return (
    <div>
      {/* Header với button tạo mới */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📦 Quản lý Đơn hàng</h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng</p>
        </div>
        <button
          onClick={() => setShowCreateOrder(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
        >
          <span className="mr-2">+</span>
          Tạo đơn hàng mới
        </button>
      </div>

      {/* Order List */}
      <OrderList />

      {/* Create Order Modal */}
      {showCreateOrder && (
        <CreateOrder
          onSuccess={() => {
            setShowCreateOrder(false);
            // Có thể thêm reload order list ở đây
          }}
          onCancel={() => setShowCreateOrder(false)}
        />
      )}
    </div>
  );
}
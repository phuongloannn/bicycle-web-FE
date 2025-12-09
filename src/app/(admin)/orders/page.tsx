'use client';

import React, { useState } from 'react';
import OrderList from '@/components/orders/OrderList';
import CreateOrder from '@/components/orders/CreateOrder';

export default function OrdersPage() {
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F2D8EE' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-purple-900 mb-1">📦 Quản lý Đơn hàng</h1>
          <p className="text-purple-800">Quản lý và theo dõi tất cả đơn hàng</p>
        </div>
        <button
          onClick={() => setShowCreateOrder(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#8B278C] via-[#B673BF] to-[#D2A0D9] text-white rounded-lg hover:opacity-90 transition duration-200 flex items-center font-semibold shadow-lg"
        >
          <span className="mr-2 text-xl font-bold">+</span>
          Tạo đơn hàng mới
        </button>
      </div>

      {/* Order List */}
      <div className="mb-12">
        <OrderList />
      </div>

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

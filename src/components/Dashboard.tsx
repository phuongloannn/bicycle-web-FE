'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Types cho dữ liệu từ API
interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockProducts: number;
  monthlyGrowth: number;
  conversionRate: number;
}

interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  imageUrl: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axios.get(`${API_BASE}/dashboard/stats`);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🚀 Dashboard Quản lý</h1>
        <p className="text-gray-600">Tổng quan hệ thống và thống kê thời gian thực</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Products */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Tổng sản phẩm</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Tổng đơn hàng</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100">Tổng doanh thu</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-r from-green-500 to-teal-400 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Khách hàng</p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Growth & Alert Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Tăng trưởng tháng</p>
              <p className="text-2xl font-bold text-green-600">{stats.monthlyGrowth}%</p>
            </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Tỷ lệ chuyển đổi</p>
              <p className="text-2xl font-bold text-blue-600">{stats.conversionRate}%</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-red-800">Sản phẩm sắp hết hàng</p>
                <p className="text-red-600">{stats.lowStockProducts} sản phẩm</p>
              </div>
            </div>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              CẢNH BÁO
            </span>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={fetchDashboardData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center transition duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới dữ liệu
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
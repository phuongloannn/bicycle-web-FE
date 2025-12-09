"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, DollarLineIcon, PieChartIcon } from "@/icons";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockProducts: number;
  monthlyGrowth: number;
  conversionRate: number;
  customersGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  revenueGrowth: number;
}

export const EcommerceMetrics = ({setIsLoading}: {setIsLoading: (isLoading: boolean) => void}) => {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
    customersGrowth: 0,
    productsGrowth: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const statsRes = await axios.get(`${API_BASE}/dashboard/stats`);
      if(statsRes.status === 200) {
        setStats(statsRes.data);
      } else {
        console.error('Lỗi khi tải dữ liệu:', statsRes.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }finally {
      setIsLoading(false);
    }
  };

  const formatMoney = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
      }).format(amount);
    return formattedAmount
  }
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {[
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: <GroupIcon className="size-7 text-white" />,
      change: stats.customersGrowth,
      badgeColor: "success",
      bg: "from-blue-500 to-blue-600",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: <BoxIconLine className="size-7 text-white" />,
      change: stats.ordersGrowth,
      badgeColor: "success",
      bg: "from-amber-500 to-amber-600",
    },
    {
      title: "Revenue",
      value: formatMoney(stats.totalRevenue),
      icon: <DollarLineIcon className="size-7 text-white" />,
      change: stats.revenueGrowth,
      badgeColor: "success",
      bg: "from-green-500 to-green-600",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      icon: <PieChartIcon className="size-7 text-white" />,
      change: stats.productsGrowth,
      badgeColor: "success",
      bg: "from-purple-500 to-purple-600",
    },
  ].map((item, index) => (
    <div
      key={index}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm 
                 dark:border-gray-800 dark:bg-white/[0.03] 
                 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start gap-4 flex-col">
        <div className="flex flex-row gap-4 items-center">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.bg} text-white shadow-md`}
          >
            {item.icon}
          </div>

          <p className="text-base font-medium text-gray-600 dark:text-gray-400">
            {item.title}
          </p>
        </div>

        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          {item.value}
        </span>
      </div>

      <div className="flex flex-row items-center gap-2 mt-4">
        <div
          className={`flex items-center rounded-[8px] px-2 py-1 ${
            item.change < 0
              ? "text-red-600 bg-red-100"
              : "text-green-600 bg-green-100"
          }`}
        >
          {item.change < 0 ? (
            <ArrowDownIcon className="size-4" />
          ) : (
            <ArrowUpIcon className="size-4" />
          )}
          {Math.abs(item.change)}%
        </div>

        <span className="text-gray-400 font-light text-xs">vs last month</span>
      </div>
    </div>
  ))}
</div>
  );
};

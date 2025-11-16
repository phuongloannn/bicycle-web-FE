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
}

export const EcommerceMetrics = ({setIsLoading}: {setIsLoading: (isLoading: boolean) => void}) => {
  const API_BASE = 'http://localhost:3000';

  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
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
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-6 space-y-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-black size-6 dark:text-white/90" />
            </div>
            <span className="text-sm !text-black dark:!text-gray-400 col-span-12">
              Customers
            </span>
          </div>
          <div className="col-span-6 space-y-6 flex items-center justify-center">
            <span className="text-4xl font-bold !text-black dark:!text-white">
              {stats.totalCustomers}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-end mt-3"> 
          <Badge color="success">
            <ArrowUpIcon />
            10.01%
          </Badge> 
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-6 space-y-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <BoxIconLine className="text-black dark:text-white/90" />
            </div>
            <span className="text-sm !text-black dark:!text-gray-400 col-span-12">
              Orders
            </span>
          </div>
          <div className="col-span-6 space-y-6 flex items-center justify-center">
            <span className="text-4xl font-bold !text-black dark:!text-white">
              {stats.totalOrders}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-end mt-3"> 
          <Badge color="success">
            <ArrowUpIcon />
            24.5%
          </Badge> 
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-6 space-y-6"> 
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800"> 
              <DollarLineIcon className="text-black size-6 dark:text-white/90" />
            </div>
            <span className="text-sm !text-black dark:!text-gray-400 col-span-12">
              Revenue
            </span>
          </div>
          <div className="col-span-6 space-y-6 flex items-center justify-center">
            <span className="text-4xl font-bold !text-black dark:!text-white">
              {stats.totalRevenue}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-end mt-3"> 
          <Badge color="success">
            <ArrowUpIcon />
            29.5%
          </Badge> 
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-6 space-y-6"> 
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800"> 
              <PieChartIcon className="text-black size-6 dark:text-white/90" />
            </div>
            <span className="text-sm !text-black dark:!text-gray-400 col-span-12">
              Products
            </span>
          </div>
          <div className="col-span-6 space-y-6 flex items-center justify-center">
            <span className="text-4xl font-bold !text-black dark:!text-white">
              {stats.totalProducts}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-end mt-3"> 
          <Badge color="success">
            <ArrowUpIcon />
            30.0%
          </Badge> 
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};

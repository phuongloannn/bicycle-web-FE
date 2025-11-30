"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [chart, setChart] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, chartRes, topRes, actRes] = await Promise.all([
          fetch("http://localhost:3000/dashboard/stats"),
          fetch("http://localhost:3000/dashboard/sales-chart"),
          fetch("http://localhost:3000/dashboard/top-products"),
          fetch("http://localhost:3000/dashboard/recent-activities"),
        ]);

        const statsData = await statsRes.json();
        const chartData = await chartRes.json();
        const topData = await topRes.json();
        const actData = await actRes.json();

        setStats(statsData);
        setChart(chartData);
        setTopProducts(topData);
        setActivities(actData);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-medium text-gray-600">
        Loading dashboard data...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠️ Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Dashboard</h1>

      {/* --- Tổng quan --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">
              {stats.totalCustomers ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">
              {stats.totalOrders ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-amber-600">
              ${stats.totalRevenue?.toLocaleString() ?? "0"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Product</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-purple-600">
              {stats.topProduct ?? "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Biểu đồ doanh thu --- */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Top sản phẩm --- */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {topProducts.length === 0 ? (
              <li className="text-gray-500">No top products found.</li>
            ) : (
              topProducts.map((p, i) => (
                <li
                  key={i}
                  className="flex justify-between border-b pb-1 text-gray-700"
                >
                  <span>{p.name}</span>
                  <span className="font-semibold">{p.sales} sold</span>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>

      {/* --- Hoạt động gần đây --- */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {activities.length === 0 ? (
              <li className="text-gray-500">No recent activity.</li>
            ) : (
              activities.map((a, i) => (
                <li key={i} className="text-gray-700">
                  • {a.message ?? JSON.stringify(a)}
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

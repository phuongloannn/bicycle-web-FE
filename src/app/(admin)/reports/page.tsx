'use client';

import React, { useEffect, useState } from 'react';
import {
  RevenueGroupBy,
  RevenueReportItem,
  OrdersReportItem,
  InventoryReportItem,
  TopCustomerItem,
  getRevenueReport,
  getOrdersReport,
  getInventoryReport,
  getTopCustomers,
  buildExportUrl,
} from '@/lib/api/reports';

export default function ReportsPage() {
  const [groupBy, setGroupBy] = useState<RevenueGroupBy>('month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [revenue, setRevenue] = useState<RevenueReportItem[]>([]);
  const [orders, setOrders] = useState<OrdersReportItem[]>([]);
  const [inventory, setInventory] = useState<InventoryReportItem[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (value: string) => {
    if (!value) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rev, ord, inv, cust] = await Promise.all([
        getRevenueReport({ groupBy, from: from || undefined, to: to || undefined }),
        getOrdersReport({ from: from || undefined, to: to || undefined }),
        getInventoryReport(),
        getTopCustomers(5),
      ]);
      setRevenue(rev);
      setOrders(ord);
      setInventory(inv);
      setTopCustomers(cust);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalRevenue = revenue.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = revenue.reduce((sum, r) => sum + r.orders, 0);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#8B278C] mb-2">
          📈 Business Reports
        </h1>
        <p className="text-[#B673BF] text-lg">
          Revenue, orders, inventory and customer insights
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="mb-6 bg-white rounded-2xl border border-[#D2A0D9] p-4 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#8B278C] mb-1">
            Group by
          </label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as RevenueGroupBy)}
            className="px-4 py-2 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C]"
          >
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#8B278C] mb-1">
            From
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-4 py-2 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C]"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#8B278C] mb-1">
            To
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-4 py-2 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C]"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="mt-5 px-6 py-2 bg-gradient-to-r from-[#8B278C] to-[#B673BF] text-white font-semibold rounded-xl hover:from-[#B673BF] hover:to-[#8B278C] disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'Apply'}
          </button>

          <a
            href={buildExportUrl({
              type: 'revenue',
              groupBy,
              from: from || undefined,
              to: to || undefined,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 px-6 py-2 border-2 border-[#B673BF] text-[#8B278C] font-semibold rounded-xl hover:bg-[#F2D8EE]"
          >
            Export Revenue (CSV)
          </a>

          <a
            href={buildExportUrl({
              type: 'orders',
              from: from || undefined,
              to: to || undefined,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 px-6 py-2 border-2 border-[#B673BF] text-[#8B278C] font-semibold rounded-xl hover:bg-[#F2D8EE]"
          >
            Export Orders (CSV)
          </a>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-green-100">Total revenue</p>
          <p className="text-2xl font-bold">
            {totalRevenue.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-blue-100">Total orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-purple-100">Low stock items</p>
          <p className="text-2xl font-bold">
            {inventory.filter((i) => i.belowMin).length}
          </p>
        </div>
      </div>

      {/* GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue table */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#D2A0D9] overflow-hidden">
          <div className="p-4 border-b border-[#D2A0D9] bg-gradient-to-r from-[#8B278C] to-[#B673BF]">
            <h2 className="text-xl font-bold text-white">Revenue report</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F2D8EE]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Period
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Orders
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D8EE]">
                {revenue.map((r) => (
                  <tr key={r.period}>
                    <td className="px-4 py-2 text-sm text-gray-800">{r.period}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{r.orders}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {r.revenue.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </td>
                  </tr>
                ))}
                {revenue.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#D2A0D9] overflow-hidden">
          <div className="p-4 border-b border-[#D2A0D9] bg-gradient-to-r from-[#8B278C] to-[#B673BF]">
            <h2 className="text-xl font-bold text-white">Orders report</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F2D8EE]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Total
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Pending
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Paid
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Shipped
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Canceled
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D8EE]">
                {orders.map((o) => (
                  <tr key={o.date}>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {formatDate(o.date)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {o.totalOrders}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">{o.pending}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{o.paid}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{o.shipped}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{o.canceled}</td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* INVENTORY + TOP CUSTOMERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-[#D2A0D9] overflow-hidden">
          <div className="p-4 border-b border-[#D2A0D9] bg-gradient-to-r from-[#8B278C] to-[#B673BF] flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Inventory report</h2>
            <a
              href={buildExportUrl({ type: 'inventory' })}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 text-xs bg-white text-[#8B278C] font-semibold rounded-full hover:bg-[#F2D8EE]"
            >
              Export CSV
            </a>
          </div>
          <div className="overflow-x-auto max-h-[380px]">
            <table className="w-full">
              <thead className="bg-[#F2D8EE]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Reserved
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Min
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D8EE]">
                {inventory.map((i) => (
                  <tr key={`${i.productId}-${i.categoryName ?? 'none'}`}>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {i.productName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {i.categoryName ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {i.quantity}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {i.reserved}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          i.belowMin
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}
                      >
                        {i.minStock} (free: {i.available})
                      </span>
                    </td>
                  </tr>
                ))}
                {inventory.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#D2A0D9] overflow-hidden">
          <div className="p-4 border-b border-[#D2A0D9] bg-gradient-to-r from-[#8B278C] to-[#B673BF]">
            <h2 className="text-xl font-bold text-white">
              Top customers by spending
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F2D8EE]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Orders
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-[#8B278C] uppercase">
                    Total amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D8EE]">
                {topCustomers.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      <div className="flex flex-col">
                        <span className="font-semibold">{c.name}</span>
                        {c.email && (
                          <span className="text-xs text-gray-500">{c.email}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {c.totalOrders}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {c.totalAmount.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </td>
                  </tr>
                ))}
                {topCustomers.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}



// src/lib/api/reports.ts
import { apiClient } from "./client";

export type RevenueGroupBy = "day" | "week" | "month" | "year";

export interface RevenueReportItem {
  period: string;
  orders: number;
  revenue: number;
}

export interface OrdersReportItem {
  date: string;
  totalOrders: number;
  pending: number;
  paid: number;
  shipped: number;
  canceled: number;
}

export interface InventoryReportItem {
  productId: number;
  productName: string;
  categoryName: string | null;
  quantity: number;
  reserved: number;
  available: number;
  minStock: number;
  belowMin: boolean;
}

export interface TopCustomerItem {
  id: number;
  name: string;
  email: string | null;
  totalOrders: number;
  totalAmount: number;
}

export interface TrendItem {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export const getRevenueReport = (params: {
  groupBy: RevenueGroupBy;
  from?: string;
  to?: string;
}) =>
  apiClient.get<RevenueReportItem[]>(
    `/reports/revenue?groupBy=${params.groupBy}${
      params.from ? `&from=${encodeURIComponent(params.from)}` : ""
    }${params.to ? `&to=${encodeURIComponent(params.to)}` : ""}`,
  );

export const getOrdersReport = (params: { from?: string; to?: string }) =>
  apiClient.get<OrdersReportItem[]>(
    `/reports/orders${
      params.from || params.to
        ? `?${[
            params.from ? `from=${encodeURIComponent(params.from)}` : "",
            params.to ? `to=${encodeURIComponent(params.to)}` : "",
          ]
            .filter(Boolean)
            .join("&")}`
        : ""
    }`,
  );

export const getInventoryReport = () =>
  apiClient.get<InventoryReportItem[]>("/reports/inventory");

export const getTopCustomers = (limit = 5) =>
  apiClient.get<TopCustomerItem[]>(`/reports/top-customers?limit=${limit}`);

export const getTrends = (days = 30) =>
  apiClient.get<TrendItem[]>(`/reports/trends?days=${days}`);

export const buildExportUrl = (params: {
  type: "revenue" | "orders" | "inventory";
  groupBy?: RevenueGroupBy;
  from?: string;
  to?: string;
}) => {
  const base =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
      : "";
  const q = new URLSearchParams();
  q.set("type", params.type);
  if (params.groupBy) q.set("groupBy", params.groupBy);
  if (params.from) q.set("from", params.from);
  if (params.to) q.set("to", params.to);
  return `${base}/reports/export?${q.toString()}`;
};



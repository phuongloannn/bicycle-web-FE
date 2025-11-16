"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import axios from "axios";

// Define the TypeScript interface for recent activities
interface RecentActivity {
  id: number;
  action: string;
  user: string;
  time: string;
  type: "order" | "product" | "payment" | "user";
}

export default function RecentOrders() {
  const API_BASE = "http://localhost:3000";
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/dashboard/recent-activities`);
        if (response.status === 200) {
          setActivities(response.data);
        } else {
          console.error("Lỗi khi tải dữ liệu:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Recent Activities
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y bg-gray-50 dark:bg-gray-800/50">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 pl-3 font-semibold text-gray-700 uppercase tracking-wider text-start text-theme-xs dark:text-gray-300"
              >
                Action
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-semibold text-gray-700 uppercase tracking-wider text-start text-theme-xs dark:text-gray-300"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-semibold text-gray-700 uppercase tracking-wider text-start text-theme-xs dark:text-gray-300"
              >
                Time
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-semibold text-gray-700 uppercase tracking-wider text-start text-theme-xs dark:text-gray-300"
              >
                Type
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </TableRow>
            ) : activities.length === 0 ? (
              <TableRow>
                <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No data
                </td>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id} className="">
                  <TableCell className="py-3 pl-3">
                    <p className="font-medium text-gray-800 dark:text-white text-theme-sm">
                      {activity.action}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {activity.user}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {activity.time}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        activity.type === "order"
                          ? "success"
                          : activity.type === "product"
                          ? "warning"
                          : activity.type === "payment"
                          ? "info"
                          : "light"
                      }
                    >
                      {activity.type === "order"
                        ? "Order"
                        : activity.type === "product"
                        ? "Product"
                        : activity.type === "payment"
                        ? "Payment"
                        : "User"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

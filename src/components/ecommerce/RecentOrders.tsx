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
        setActivities(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentActivities();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 sm:px-6 shadow-sm">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Recent Activities</h3>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
            Filter
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
            See all
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b bg-gray-50">
            <TableRow>
              <TableCell isHeader className="py-3 pl-3 font-semibold text-gray-900 uppercase text-start text-sm">Action</TableCell>
              <TableCell isHeader className="py-3 font-semibold text-gray-900 uppercase text-start text-sm">User</TableCell>
              <TableCell isHeader className="py-3 font-semibold text-gray-900 uppercase text-start text-sm">Time</TableCell>
              <TableCell isHeader className="py-3 font-semibold text-gray-900 uppercase text-start text-sm">Type</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {loading ? (
              <TableRow>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  Loading...
                </td>
              </TableRow>
            ) : activities.length === 0 ? (
              <TableRow>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No data
                </td>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="py-3 pl-3 text-gray-800 text-sm">{activity.action}</TableCell>
                  <TableCell className="py-3 text-gray-800 text-sm">{activity.user}</TableCell>
                  <TableCell className="py-3 text-gray-800 text-sm">{activity.time}</TableCell>
                  <TableCell className="py-3 text-gray-800 text-sm">
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
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
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

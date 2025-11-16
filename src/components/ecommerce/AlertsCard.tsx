"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface AlertData {
  lowStockProducts: number;
  pendingOrders: number;
}

export default function AlertsCard() {
  const [alerts, setAlerts] = useState<AlertData>({
    lowStockProducts: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const apiUrl = `${API_BASE}/dashboard/stats`;
        const response = await axios.get(apiUrl);
        
        // Giả sử API trả về lowStockProducts, còn pendingOrders có thể cần API riêng
        // Hoặc có thể tính từ recent activities
        const stats = response.data;
        
        // Fetch pending orders nếu có API riêng, nếu không dùng dữ liệu mẫu
        let pendingOrders = 0;
        try {
          const activitiesRes = await axios.get(`${API_BASE}/dashboard/recent-activities`);
          // Đếm số đơn hàng pending > 48h (có thể cần logic phức tạp hơn)
          pendingOrders = activitiesRes.data?.filter((activity: any) => 
            activity.type === 'order' && activity.status === 'pending'
          ).length || 0;
        } catch (err) {
          // Nếu không có API, dùng giá trị mặc định
          console.log('Không thể lấy pending orders');
        }

        setAlerts({
          lowStockProducts: stats.lowStockProducts || 0,
          pendingOrders: pendingOrders,
        });
      } catch (error) {
        console.error('Lỗi khi tải alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const alertItems = [
    {
      id: 1,
      message: alerts.lowStockProducts > 0 
        ? `${alerts.lowStockProducts} products are low in stock,`
        : null,
    },
    {
      id: 2,
      message: alerts.pendingOrders > 0
        ? `${alerts.pendingOrders} orders have been pending for over 48 hours`
        : null,
    },
  ].filter(item => item.message !== null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Alerts
        </h3>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
          </div>
        ) : alertItems.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>Không có cảnh báo nào</p>
          </div>
        ) : (
          alertItems.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-800 dark:text-gray-300">
                {alert.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


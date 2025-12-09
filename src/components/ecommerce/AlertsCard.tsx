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
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const apiUrl = `${API_BASE}/dashboard/stats`;
        const response = await axios.get(apiUrl);
        const stats = response.data;

        let pendingOrders = 0;
        try {
          const activitiesRes = await axios.get(`${API_BASE}/dashboard/recent-activities`);
          pendingOrders = activitiesRes.data?.filter((activity: any) => 
            activity.type === 'order' && activity.status === 'pending'
          ).length || 0;
        } catch (err) {
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
        ? `${alerts.lowStockProducts} products are low in stock`
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Alerts
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : alertItems.length === 0 ? (
          <div className="text-center text-gray-700 py-8">
            <p>Không có cảnh báo nào</p>
          </div>
        ) : (
          alertItems.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-900">
                {alert.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

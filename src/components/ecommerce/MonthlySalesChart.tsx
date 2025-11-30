"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@/contexts/ThemeContext";

interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const API_BASE = 'http://localhost:3000';
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<SalesChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpenRevenue, setIsOpenRevenue] = useState(false);
  const [isOpenOrders, setIsOpenOrders] = useState(false);
  
  // Màu chữ dựa trên theme
  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"; // gray-300 cho dark, gray-700 cho light
  const labelColor = theme === "dark" ? "#9ca3af" : "#6b7280"; // gray-400 cho dark, gray-500 cho light

  useEffect(() => {
    const fetchSalesChartData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<SalesChartData[]>(`${API_BASE}/dashboard/sales-chart`);
        setChartData(response.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu biểu đồ doanh số:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesChartData();
  }, []);

  // Transform dữ liệu từ API thành format cho ApexCharts
  const categories = chartData.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  });

  const revenueData = chartData.map(item => item.revenue);
  const ordersData = chartData.map(item => item.orders);

  // Options cho biểu đồ đường (Revenue)
  const revenueOptions: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: categories.length > 0 ? categories : [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          fontSize: '11px',
          colors: labelColor,
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: textColor,
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        style: {
          colors: labelColor,
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: "#465fff",
            opacity: 0.6
          },
          {
            offset: 100,
            color: "#465fff",
            opacity: 0.1
          }
        ]
      },
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val.toLocaleString('vi-VN')}`,
      },
      style: {
        fontSize: '12px',
        fontFamily: "Outfit, sans-serif",
      },
    },
  };

  // Options cho biểu đồ cột (Orders)
  const ordersOptions: ApexOptions = {
    colors: ["#10b981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
      },
      selection: {
        enabled: true,
        xaxis: {
          min: undefined,
          max: undefined,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories.length > 0 ? categories : [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          fontSize: '11px',
          colors: labelColor,
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: textColor,
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        style: {
          colors: labelColor,
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val.toLocaleString('vi-VN')}`,
      },
      style: {
        fontSize: '12px',
        fontFamily: "Outfit, sans-serif",
      },
    },
  };
  
  const revenueSeries = [
    {
      name: "Revenue",
      data: revenueData.length > 0 ? revenueData : [],
    },
  ];

  const ordersSeries = [
    {
      name: "Orders",
      data: ordersData.length > 0 ? ordersData : [],
    },
  ];

  function toggleRevenueDropdown() {
    setIsOpenRevenue(!isOpenRevenue);
  }

  function closeRevenueDropdown() {
    setIsOpenRevenue(false);
  }

  function toggleOrdersDropdown() {
    setIsOpenOrders(!isOpenOrders);
  }

  function closeOrdersDropdown() {
    setIsOpenOrders(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Biểu đồ đường - Doanh thu */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Revenue
          </h3>

          <div className="relative inline-block">
            <button onClick={toggleRevenueDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpenRevenue}
              onClose={closeRevenueDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeRevenueDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                onItemClick={closeRevenueDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            {loading ? (
              <div className="flex justify-center items-center h-[350px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ReactApexChart
                options={revenueOptions}
                series={revenueSeries}
                type="area"
                height={350}
              />
            )}
          </div>
        </div>
      </div>

      {/* Biểu đồ cột - Đơn hàng */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Orders
          </h3>

          <div className="relative inline-block">
            <button onClick={toggleOrdersDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpenOrders}
              onClose={closeOrdersDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeOrdersDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                onItemClick={closeOrdersDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            {loading ? (
              <div className="flex justify-center items-center h-[350px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ReactApexChart
                options={ordersOptions}
                series={ordersSeries}
                type="bar"
                height={350}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

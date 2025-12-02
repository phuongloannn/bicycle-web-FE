"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const series = [40, 20, 30, 10];
  const options: ApexOptions = {
    colors: ["#1E40AF", "#3B82F6", "#60A5FA", "#93C5FD"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: 330,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    labels: ["Processing", "Completed", "Ronding", "Cancelled"],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      fontFamily: "Outfit, sans-serif",
      fontWeight: 500,
      labels: {
        colors: ["#1E293B", "#1E293B", "#1E293B", "#1E293B"], // Use dark color for light theme
      },
      formatter: function (seriesName: string, opts: any) {
        return seriesName + ": " + opts.w.globals.series[opts.seriesIndex] + "%";
      },
      markers: {
        size: 8,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + "%";
        },
      },
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Orders
            </h3>
            <p className="mt-1 font-normal text-gray-600 dark:text-gray-400 text-theme-sm">
              Distribution of order statuses
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-center" style={{ minHeight: 330 }}>
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={330}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

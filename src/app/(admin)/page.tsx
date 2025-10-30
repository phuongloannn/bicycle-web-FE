"use client";
import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useRouter } from "next/navigation";

export default function Ecommerce() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ CHECK LOCALSTORAGE TRÊN CLIENT
    const token = localStorage.getItem('token');
    console.log('🔍 Client token check:', token);

    if (!token) {
      console.log('❌ No token, redirecting to signin');
      router.push('/signin');
    } else {
      console.log('✅ Token found, allowing access');
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
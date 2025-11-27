import React from "react";

export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gradient-to-br from-[#F2D8EE] to-[#D4ADD9] px-4 py-5 text-center border border-[#D2A0D9] shadow-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <p className="text-xs text-[#B673BF]">This Month</p>
          <p className="text-lg font-bold text-[#8B278C]">1,234</p>
          <p className="text-xs text-[#B673BF]">Orders</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
          <span className="text-sm font-bold text-[#8B278C]">↑12%</span>
        </div>
      </div>
      
      <div className="w-full bg-white rounded-full h-2">
        <div 
          className="bg-[#8B278C] h-2 rounded-full" 
          style={{ width: '75%' }}
        ></div>
      </div>
      <p className="mt-2 text-xs text-[#B673BF]">75% of monthly goal</p>
    </div>
  );
}
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { StoreService } from "@/services/StoreService";

export default function StoreHeader() {
  const { state } = useCart();
  const [categories, setCategories] = useState<string[]>([]);
  const [accessoryCategories, setAccessoryCategories] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showAccessoryCategories, setShowAccessoryCategories] = useState(false);

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const service = new StoreService();
        const data = await service.getCategories();
        setCategories(data.slice(0, 6));
        
        // Dựa trên categories từ accessories của bạn
        setAccessoryCategories([
          "Bảo hộ",
          "Dụng cụ", 
          "Phụ kiện điện tử",
          "Túi & Balo",
          "Đèn xe",
          "Khóa & Bảo vệ",
          "Chắn bùn",
          "Giá đỡ",
          "Bình nước"
        ]);
      } catch {}
    };
    fetchData();
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-lg border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">

        {/* ✅ Logo */}
        <Link href="/store" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">SX</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SportX
          </span>
        </Link>

        {/* ✅ Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="/store">Trang chủ</NavLink>

          {/* Danh mục sản phẩm chính */}
          <div
            className="relative"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <button className="font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300 flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-blue-50">
              <span>Xe đạp</span>
              <svg className={`w-4 h-4 transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showCategories && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl rounded-xl p-4 border border-gray-200">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                  Dòng Xe
                </div>
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/store/categories/${encodeURIComponent(category)}`}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="font-medium">{category}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Danh mục phụ kiện */}
          <div
            className="relative"
            onMouseEnter={() => setShowAccessoryCategories(true)}
            onMouseLeave={() => setShowAccessoryCategories(false)}
          >
            <button className="font-semibold text-gray-800 hover:text-purple-600 transition-all duration-300 flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-purple-50">
              <span>Phụ kiện</span>
              <svg className={`w-4 h-4 transition-transform duration-300 ${showAccessoryCategories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAccessoryCategories && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-2xl rounded-xl p-4 border border-gray-200">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                  Danh Mục Phụ Kiện
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {accessoryCategories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/store/accessories?category=${encodeURIComponent(category)}`}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="font-medium">{category}</span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3">
                  <Link
                    href="/store/accessories"
                    className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>Xem tất cả phụ kiện</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink href="/store/products">Tất cả sản phẩm</NavLink>
        </nav>

        {/* ✅ Cart */}
        <Link 
          href="/store/cart" 
          className="relative p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L4.5 18.5M7 13l2.5 5.5M10 18.5L17 21" />
            </svg>
            
            {itemCount > 0 && (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 group-hover:text-blue-500">Giỏ hàng</span>
                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-700">{itemCount} sản phẩm</span>
              </div>
            )}
          </div>

          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-6 h-6 text-xs flex items-center justify-center rounded-full shadow-lg border-2 border-white font-bold">
              {itemCount}
            </span>
          )}
        </Link>

      </div>
    </header>
  );
}

function NavLink({ href, children }: any) {
  return (
    <Link
      href={href}
      className="text-gray-800 font-semibold relative group transition-all duration-300 py-2 px-3 rounded-lg hover:bg-gray-50"
    >
      {children}
      <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
    </Link>
  );
}
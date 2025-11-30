'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { StoreService } from "@/services/StoreService";

export default function StoreHeader() {
  const { state } = useCart();
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const service = new StoreService();
        const data = await service.getCategories();
        setCategories(data.slice(0, 6));
      } catch {}
    };
    fetchData();
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">

        {/* ✅ Logo */}
        <Link href="/store" className="text-3xl font-extrabold tracking-tight text-blue-700">
          SportX
        </Link>

        {/* ✅ Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="/store">Trang chủ</NavLink>

          <div
            className="relative"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <button className="font-medium text-gray-700 hover:text-blue-600 transition flex items-center">
              Danh mục
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" />
              </svg>
            </button>

            {showCategories && (
              <div className="absolute top-full left-0 mt-3 w-56 bg-white shadow-xl rounded-xl p-3 border">
                {categories.map((c, i) => (
                  <Link
                    key={i}
                    href={`/store/categories/${encodeURIComponent(c)}`}
                    className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink href="/store/products">Sản phẩm</NavLink>
        </nav>

        {/* ✅ Cart */}
        <Link href="/store/cart" className="relative p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L4.5 18.5M7 13l2.5 5.5M10 18.5L17 21" />
          </svg>

          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full shadow">
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
      className="text-gray-700 font-medium relative group"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
    </Link>
  );
}

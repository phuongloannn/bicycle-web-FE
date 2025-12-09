'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  imageUrl: string;
}

interface ProductItemProps {
  product: TopProduct;
  apiBase: string;
  formatCurrency: (amount: number) => string;
}

function ProductItem({ product, apiBase, formatCurrency }: ProductItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {product.imageUrl && !imageError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-fit"
              onError={() => setImageError(true)}
            />
          ) : (
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="currentColor"
              className="text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="36" r="4" />
              <circle cx="36" cy="36" r="4" />
              <path d="M16 36L20 24L28 20L32 36" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M20 24L24 16L28 20" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M16 36L12 36M36 36L32 36" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {product.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-gray-800">
          {product.sales} (s)
        </p>
        <p className="text-sm font-medium text-gray-800">
          {formatCurrency(product.revenue)}
        </p>
      </div>
    </div>
  );
}

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const apiUrl = `${API_BASE}/dashboard/top-products`;
        console.log('📡 Đang gọi API:', apiUrl);
        const response = await axios.get<TopProduct[]>(apiUrl);
        console.log('✅ Dữ liệu nhận được:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error(' Lỗi khi tải danh sách sản phẩm:', error);
        if (axios.isAxiosError(error)) {
          console.error('Chi tiết lỗi:', error.response?.data || error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Best Selling Products
          </h3>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-800">Không có sản phẩm nào</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              apiBase={API_BASE}
              formatCurrency={formatCurrency}
            />
          ))
        )}
      </div>
    </div>
  );
}

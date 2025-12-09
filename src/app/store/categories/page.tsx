// src/app/store/categories/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StoreService } from '../../../services/StoreService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const storeService = new StoreService();
        const categoriesData = await storeService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Đang tải danh mục...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Danh Mục Sản Phẩm</h1>
      
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Không có danh mục nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <Link
              key={idx}
              href={`/store/categories/${encodeURIComponent(category)}`}
              className="group bg-white border rounded-lg shadow p-6 text-center hover:shadow-lg transition duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                {category}
              </h3>
              <p className="text-sm text-gray-500 mt-2 group-hover:text-blue-600 transition">
                Khám phá ngay →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

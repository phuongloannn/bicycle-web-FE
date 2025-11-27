'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { StoreService } from '@/services/StoreService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const service = new StoreService();
      const data = await service.getCategories();
      setCategories(data);
    };
    fetch();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-8">Danh mục sản phẩm</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((c, i) => (
          <Link
            key={i}
            href={`/store/categories/${encodeURIComponent(c)}`}
            className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">{c}</h2>
            <p className="text-sm text-gray-500 mt-2">Khám phá các sản phẩm thuộc danh mục này</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// src/app/store/categories/[name]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '../../../../types/store';
import { StoreService } from '../../../../services/StoreService';
import ProductCard from '../../../../components/store/ProductCard';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.name as string);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');

  useEffect(() => {
    async function loadCategoryData() {
      try {
        const storeService = new StoreService();
        const [allProducts, categories] = await Promise.all([
          storeService.getProducts(),
          storeService.getCategories()
        ]);
        
        // Filter products by category
        const categoryProducts = allProducts.filter(
          product => product.category.toLowerCase() === categoryName.toLowerCase()
        );
        
        setProducts(categoryProducts);
        setAllCategories(categories);
      } catch (error) {
        console.error('Failed to load category data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (categoryName) {
      loadCategoryData();
    }
  }, [categoryName]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'stock':
        return (b.stock || b.quantity) - (a.stock || a.quantity);
      default:
        return 0;
    }
  });

  const inStockProducts = products.filter(p => p.stock > 0 || p.quantity > 0);
  const outOfStockProducts = products.filter(p => (p.stock === 0 && p.quantity === 0));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg">Đang tải sản phẩm...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <Link href="/store" className="text-gray-400 hover:text-gray-500">
              Trang chủ
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <Link href="/store/categories" className="text-gray-400 hover:text-gray-500">
              Danh mục
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white p-8 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {categoryName}
        </h1>
        <div className="text-xl opacity-90">
          {products.length} sản phẩm
          {inStockProducts.length > 0 && ` • ${inStockProducts.length} sản phẩm có sẵn`}
        </div>
        
        {/* Quick Category Navigation */}
        {allCategories.length > 1 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {allCategories.map((category) => (
              <Link
                key={category}
                href={`/store/categories/${encodeURIComponent(category)}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-300 ${
                  category === categoryName
                    ? 'bg-white text-blue-600'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sort and Filter Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Hiển thị {sortedProducts.length} sản phẩm
          </h2>
          {inStockProducts.length > 0 && (
            <p className="text-green-600 text-sm mt-1">
              {inStockProducts.length} sản phẩm có sẵn
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 text-sm font-medium">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="name">Theo tên A-Z</option>
              <option value="price">Giá thấp đến cao</option>
              <option value="stock">Số lượng tồn kho</option>
            </select>
          </div>

          <Link
            href="/store/categories"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 text-sm font-medium"
          >
            ← Tất cả danh mục
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div>
          {/* In Stock Products */}
          {inStockProducts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Sản phẩm có sẵn ({inStockProducts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts
                  .filter(product => product.stock > 0 || product.quantity > 0)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                }
              </div>
            </div>
          )}

          {/* Out of Stock Products */}
          {outOfStockProducts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                Sản phẩm hết hàng ({outOfStockProducts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-60">
                {outOfStockProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Hết hàng
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Không có sản phẩm trong danh mục này
          </h3>
          <p className="text-lg mb-8">
            Hiện tại không có sản phẩm nào trong danh mục "{categoryName}".
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/store/categories"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
            >
              ← Quay lại danh mục
            </Link>
            <Link
              href="/store/products"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300 font-semibold"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      )}

      {/* Category Stats */}
      {products.length > 0 && (
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Thống kê danh mục
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {products.length}
              </div>
              <div className="text-gray-600">Tổng sản phẩm</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {inStockProducts.length}
              </div>
              <div className="text-gray-600">Sản phẩm có sẵn</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {outOfStockProducts.length}
              </div>
              <div className="text-gray-600">Sản phẩm hết hàng</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
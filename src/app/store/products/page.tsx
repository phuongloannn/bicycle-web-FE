// src/app/store/products/page.tsx
'use client';
import { useEffect, useState } from 'react';
// Sửa: Dùng relative path
import { Product } from '../../../types/store';
import { StoreService } from '../../../services/StoreService';
import ProductCard from '../../../components/store/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const storeService = new StoreService();
        const [productsData, categoriesData] = await Promise.all([
          storeService.getProducts(),
          storeService.getCategories()
        ]);
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tất cả sản phẩm</h1>
        <p className="text-xl text-gray-600 mb-8">
          Khám phá {products.length} sản phẩm đa dạng
        </p>
        
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, mô tả hoặc danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg min-w-48"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 text-lg"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-gray-600">
          Hiển thị {filteredProducts.length} sản phẩm
          {searchTerm && ` cho từ khóa "${searchTerm}"`}
          {selectedCategory && ` trong danh mục "${selectedCategory}"`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl mb-4">Không tìm thấy sản phẩm nào phù hợp.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
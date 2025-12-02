'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  searchProducts,
} from '@/lib/api/products';
import { Category, getCategories } from '@/lib/api/categories';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    imageUrl: '',
    imageFilename: '',
  });

  // 🔥 Hàm format tiền VND - bỏ .00
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      // Không chặn toàn bộ trang nếu load category lỗi
      console.error('Failed to load categories', err);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    try {
      let data;
      if (query.trim() === '') {
        data = await getProducts();
      } else {
        data = await searchProducts(query);
      }
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const uploadResult = await uploadProductImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: uploadResult.url,
        imageFilename: uploadResult.filename,
      }));
      setImagePreview(uploadResult.url);
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: any = {
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category: formData.category || undefined,
      imageUrl: formData.imageUrl || undefined,
      imageFilename: formData.imageFilename || undefined,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await createProduct(productData);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product');
      }
    }
  };

  const startEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category || '',
      imageUrl: product.imageUrl || product.image_url || '',
      imageFilename: product.imageFilename || product.image_filename || '',
    });
    setImagePreview(product.imageUrl || product.image_url || null);
    setEditingId(product.id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      imageUrl: '',
      imageFilename: '',
    });
    setImagePreview(null);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const SearchBar = () => (
    <div className="mb-6">
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search products by name, description, or category..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900 placeholder-gray-400"
        />
        <div className="absolute right-3 top-3">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8B278C]"></div>
          ) : (
            <svg className="w-5 h-5 text-[#B673BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>
      {searchQuery && (
        <p className="mt-2 text-sm text-[#8B278C]">
          Found {products.length} products matching "{searchQuery}"
        </p>
      )}
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B278C] mx-auto mb-4"></div>
          <p className="text-[#8B278C] font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#8B278C] mb-2">🛍️ Product Management</h1>
        <p className="text-[#B673BF] text-lg">Manage your products inventory</p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <SearchBar />
      
      {/* ADD/EDIT FORM */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#D2A0D9]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#8B278C]">
            {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm text-[#8B278C] hover:text-[#B673BF] transition-colors"
            >
              ↶ Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900 placeholder-gray-400"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Price (VND) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                step="1000"
                min="0"
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
                placeholder="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                min="0"
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
                placeholder="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
              >
                <option value="">-- Select category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div className="bg-gradient-to-r from-[#F2D8EE] to-[#D4ADD9] p-6 rounded-2xl border border-[#D2A0D9]">
            <label className="block text-lg font-bold text-[#8B278C] mb-4">
              🖼️ Product Image
            </label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="product-image"
                />
                <label
                  htmlFor="product-image"
                  className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    uploadingImage 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-[#8B278C] text-white hover:bg-[#B673BF] hover:shadow-lg'
                  }`}
                >
                  {uploadingImage ? '📤 Uploading...' : '📁 Choose Image'}
                </label>
              </div>
              
              {imagePreview && (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-xl border-2 border-[#B673BF] shadow-md"
                  />
                </div>
              )}
            </div>
            
            {formData.imageFilename && (
              <p className="mt-3 text-sm text-[#8B278C] font-medium">
                📄 File: {formData.imageFilename}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-lg font-bold text-[#8B278C] mb-3">
              📝 Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900 resize-none"
              rows={4}
              placeholder="Enter product description..."
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-[#8B278C] to-[#B673BF] text-white font-semibold rounded-xl hover:from-[#B673BF] hover:to-[#8B278C] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {editingId ? '💾 Update Product' : '✨ Add Product'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-[#B673BF] text-[#8B278C] font-semibold rounded-xl hover:bg-[#F2D8EE] transition-all duration-200"
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PRODUCTS LIST */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-[#D2A0D9] bg-gradient-to-r from-[#8B278C] to-[#B673BF]">
          <h2 className="text-2xl font-bold text-white">
            📦 Product List ({products.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F2D8EE]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Name & Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F2D8EE]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#F2D8EE] transition-colors duration-200">
                  <td className="px-6 py-4">
                    {product.imageUrl || product.image_url ? (
                      <div className="flex justify-center">
                        <img
                          src={product.imageUrl || product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-[#D2A0D9] shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-[#F2D8EE] rounded-lg flex items-center justify-center border-2 border-dashed border-[#B673BF]">
                        <span className="text-[#B673BF] text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-base font-semibold text-[#8B278C]">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-600 mt-1 max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg font-bold text-[#8B278C]">
                      {formatPrice(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      product.quantity > 10 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : product.quantity > 0
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {product.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#F2D8EE] text-[#8B278C] border border-[#D2A0D9]">
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="px-3 py-1 bg-[#8B278C] text-white text-sm rounded-lg hover:bg-[#B673BF] transition-colors duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-[#8B278C] mb-2">No products found</h3>
            <p className="text-[#B673BF]">Start by adding your first product!</p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product, CreateProductDto, UpdateProductDto, getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, searchProducts } from '@/lib/api/products';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // 🔥 STATE SEARCH
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    imageUrl: '',
    imageFilename: '',
  });

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

  // 🔥 FUNCTION SEARCH
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    try {
      let data;
      if (query.trim() === '') {
        data = await getProducts(); // Lấy tất cả nếu search rỗng
      } else {
        data = await searchProducts(query); // Tìm kiếm
      }
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 HANDLE IMAGE UPLOAD
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
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload image
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: CreateProductDto = {
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
        await updateProduct(editingId, productData as UpdateProductDto);
      } else {
        await createProduct(productData);
      }
      resetForm();
      fetchProducts(); // Refresh list sau khi thêm/sửa
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refresh list sau khi xóa
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product');
      }
    }
  };

  const startEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      imageFilename: product.imageFilename || '',
    });
    setImagePreview(product.imageUrl || null);
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
  }, []);

  // 🔥 SEARCH BAR COMPONENT
  const SearchBar = () => (
    <div className="mb-6">
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search products by name, description, or category..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <div className="absolute right-3 top-2.5">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>
      {searchQuery && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Found {products.length} products matching "{searchQuery}"
        </p>
      )}
    </div>
  );

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your products inventory</p>
      </div>

      {/* 🔥 THÊM SEARCH BAR */}
      <SearchBar />
      
      {/* Add/Edit Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {editingId ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                step="0.01"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* 🔥 IMAGE UPLOAD SECTION */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-4">
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
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {uploadingImage ? 'Uploading...' : 'Choose Image'}
              </label>
              
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product List</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => startEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
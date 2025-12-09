'use client';

import React, { useState, useEffect, useRef } from 'react';

// 🔥 ĐỊNH NGHĨA TYPE CHO PHỤ KIỆN
interface Accessory {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  compatible_with: string;
  in_stock: number;
  image_url: string | null;
  image_filename: string | null;
  created_at: string;
  updated_at: string;
}

// 🔥 API SERVICE CHO ACCESSORIES
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const AccessoryService = {
  async getAccessories(): Promise<Accessory[]> {
    const response = await fetch(`${API_BASE_URL}/api/accessories`);
    if (!response.ok) throw new Error('Failed to fetch accessories');
    return response.json();
  },

  async createAccessory(data: any): Promise<Accessory> {
    const response = await fetch(`${API_BASE_URL}/api/accessories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create accessory');
    return response.json();
  },

  async updateAccessory(id: number, data: any): Promise<Accessory> {
    const response = await fetch(`${API_BASE_URL}/api/accessories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update accessory');
    return response.json();
  },

  async deleteAccessory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/accessories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete accessory');
  },

  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/api/accessories/upload-image`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    const result = await response.json();
    
    return {
      url: result.url,
      filename: result.filename
    };
  },

  async searchAccessories(query: string): Promise<Accessory[]> {
    const response = await fetch(`${API_BASE_URL}/api/accessories/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search accessories');
    return response.json();
  }
};

// 🔥 CORRECTED BIKE TYPES MAPPING - ONLY 4 MAIN TYPES
const BIKE_TYPES = [
  { id: 1, name: "Mountain Bike", display: "Xe Đạp Địa Hình" },
  { id: 2, name: "Kids Bike", display: "Xe Đạp Trẻ Em" },
  { id: 3, name: "Touring Bike", display: "Xe Đạp Tuaring" },
  { id: 4, name: "Road Bike", display: "Xe Đạp Đua" }
];

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔥 STATE FORM DATA
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    in_stock: '1',
    image_url: '',
    image_filename: '',
    compatible_with: [] as number[],
  });

  // 🔥 FETCH ACCESSORIES
  const fetchAccessories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AccessoryService.getAccessories();
      setAccessories(data);
      console.log('📦 Accessories loaded:', data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SEARCH ACCESSORIES
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    try {
      let data;
      if (query.trim() === '') {
        data = await AccessoryService.getAccessories();
      } else {
        data = await AccessoryService.searchAccessories(query);
      }
      setAccessories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 UPLOAD IMAGE
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      console.log('🔼 Starting upload...', file.name);
      const uploadResult = await AccessoryService.uploadImage(file);
      
      console.log('✅ Upload result:', uploadResult);
      
      setFormData(prev => ({
        ...prev,
        image_url: uploadResult.url,
        image_filename: uploadResult.filename
      }));
      
      setImagePreview(uploadResult.url);
      
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError('Failed to upload image: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📁 File selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      handleImageUpload(file);
    }
  };

  // 🔥 SUBMIT FORM - FIXED COMPATIBLE_WITH FORMAT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(formData.price);
    if (price <= 0) {
      setError('Giá phải lớn hơn 0');
      return;
    }

    if (formData.compatible_with.length === 0) {
      setError('Vui lòng chọn ít nhất 1 loại xe tương thích');
      return;
    }

    const imageUrl = formData.image_url && formData.image_url.length > 10 ? formData.image_url : null;
    const imageFilename = formData.image_filename && formData.image_filename.length > 0 ? formData.image_filename : null;

    console.log('📤 Submitting with image URL:', imageUrl);

    // 🔥 FIX: Sử dụng đúng format string JSON cho compatible_with
    const accessoryData = {
      name: formData.name,
      description: formData.description || null,
      price: price,
      category: formData.category || null,
      in_stock: parseInt(formData.in_stock),
      image_url: imageUrl,
      image_filename: imageFilename,
      compatible_with: JSON.stringify(formData.compatible_with.sort((a, b) => a - b)), // 🔥 CHỈ CẦN STRINGIFY ARRAY
    };

    console.log('📤 FINAL SUBMIT DATA:', accessoryData);

    try {
      if (editingId) {
        await AccessoryService.updateAccessory(editingId, accessoryData);
      } else {
        await AccessoryService.createAccessory(accessoryData);
      }
      resetForm();
      fetchAccessories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save accessory');
    }
  };

  // 🔥 DELETE ACCESSORY
  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa phụ kiện này?')) {
      try {
        await AccessoryService.deleteAccessory(id);
        fetchAccessories();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete accessory');
      }
    }
  };

  // 🔥 START EDIT - FIXED PARSING COMPATIBLE_WITH
  const startEdit = (accessory: Accessory) => {
    console.log('✏️ Editing accessory:', accessory);
    
    // 🔥 FIX: Parse compatible_with từ string JSON sang array
    let compatibleArray: number[] = [];
    try {
      if (accessory.compatible_with && accessory.compatible_with.trim() !== '') {
        compatibleArray = JSON.parse(accessory.compatible_with);
        if (!Array.isArray(compatibleArray)) {
          compatibleArray = [];
        }
      }
    } catch (error) {
      console.error('Error parsing compatible_with:', accessory.compatible_with);
      compatibleArray = [];
    }
    
    setFormData({
      name: accessory.name,
      description: accessory.description || '',
      price: accessory.price.toString(),
      category: accessory.category || '',
      in_stock: accessory.in_stock.toString(),
      image_url: accessory.image_url || '',
      image_filename: accessory.image_filename || '',
      compatible_with: compatibleArray,
    });
    
    setImagePreview(accessory.image_url || null);
    setEditingId(accessory.id);
  };

  // 🔥 RESET FORM
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      in_stock: '1',
      image_url: '',
      image_filename: '',
      compatible_with: [],
    });
    setImagePreview(null);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  // 🔥 SEARCH BAR COMPONENT
  const SearchBar = () => (
    <div className="mb-6">
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Tìm kiếm phụ kiện theo tên, mô tả, danh mục..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 border border-[#D2A0D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
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
          Tìm thấy {accessories.length} phụ kiện phù hợp "{searchQuery}"
        </p>
      )}
    </div>
  );

  if (loading && accessories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B278C] mx-auto mb-4"></div>
          <p className="text-[#8B278C] font-medium">Đang tải phụ kiện...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-[#F2D8EE] to-[#D4ADD9] min-h-screen">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#8B278C] mb-2">Quản Lý Phụ Kiện Xe Đạp</h1>
        <p className="text-[#B673BF] text-lg">Quản lý phụ kiện xe đạp và tương thích loại xe</p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span>{error}</span>
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
            {editingId ? '✏️ Sửa Phụ Kiện' : '➕ Thêm Phụ Kiện Mới'}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm text-[#8B278C] hover:text-[#B673BF] transition-colors"
            >
              ↶ Hủy chỉnh sửa
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Tên Phụ Kiện *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-[#D2A0D9] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900 placeholder-gray-400"
                placeholder="Nhập tên phụ kiện..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Giá (VND) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                step="1000"
                min="1000"
                className="w-full border border-[#D2A0D9] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
                placeholder="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Danh Mục
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-[#D2A0D9] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
                placeholder="Ví dụ: Bảo hộ, Dụng cụ, Phụ kiện..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Tình Trạng *
              </label>
              <div>
  <label className="block text-sm font-semibold text-[#8B278C] mb-2">
    Số lượng trong kho *
  </label>
  <input
    type="number"
    min={0}
    value={formData.in_stock}
    onChange={(e) => setFormData({...formData, in_stock: e.target.value})}
    className="w-full border border-[#D2A0D9] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
    placeholder="Nhập số lượng..."
    required
  />
</div>

            </div>
          </div>

          {/* 🔥 COMPATIBLE WITH SECTION - CHỈ 4 LOẠI XE */}
          <div className="bg-gradient-to-r from-[#F2D8EE] to-[#D4ADD9] p-6 rounded-2xl border border-[#D2A0D9]">
            <label className="block text-lg font-bold text-[#8B278C] mb-4">
              🚲 Tương thích với loại xe *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {BIKE_TYPES.map(bikeType => (
                <label key={bikeType.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-white hover:bg-[#F2D8EE] transition-all duration-200 border border-transparent hover:border-[#B673BF]">
                  <input
                    type="checkbox"
                    checked={formData.compatible_with.includes(bikeType.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          compatible_with: [...prev.compatible_with, bikeType.id]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          compatible_with: prev.compatible_with.filter(id => id !== bikeType.id)
                        }));
                      }
                    }}
                    className="w-5 h-5 text-[#8B278C] bg-white border-2 border-[#B673BF] rounded focus:ring-2 focus:ring-[#8B278C]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {bikeType.display}
                  </span>
                </label>
              ))}
            </div>
            
            {formData.compatible_with.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-[#B673BF]">
                <p className="text-sm font-semibold text-[#8B278C] mb-2">
                  ✅ Đã chọn {formData.compatible_with.length} loại xe:
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.compatible_with.map(id => {
                    const bikeType = BIKE_TYPES.find(bike => bike.id === id);
                    return (
                      <span
                        key={id}
                        className="px-3 py-1 bg-[#8B278C] text-white text-xs rounded-full font-medium"
                      >
                        {bikeType?.display}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <div className="bg-gradient-to-r from-[#F2D8EE] to-[#D4ADD9] p-6 rounded-2xl border border-[#D2A0D9]">
            <label className="block text-lg font-bold text-[#8B278C] mb-4">
              🖼️ Hình Ảnh Phụ Kiện
            </label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="accessory-image"
                />
                <label
                  htmlFor="accessory-image"
                  className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    uploadingImage 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-[#8B278C] text-white hover:bg-[#B673BF] hover:shadow-lg'
                  }`}
                >
                  {uploadingImage ? '📤 Đang tải...' : '📁 Chọn Hình Ảnh'}
                </label>
              </div>
              
              {imagePreview && (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-xl border-2 border-[#B673BF] shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200"></div>
                </div>
              )}
            </div>
            
            {formData.image_filename && (
              <p className="mt-3 text-sm text-[#8B278C] font-medium">
                📄 File: {formData.image_filename}
              </p>
            )}
          </div>
          
          {/* DESCRIPTION */}
          <div>
            <label className="block text-lg font-bold text-[#8B278C] mb-3">
              📝 Mô Tả Chi Tiết
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-[#D2A0D9] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900 resize-none"
              rows={4}
              placeholder="Mô tả chi tiết về phụ kiện, tính năng, chất liệu..."
            />
          </div>
          
          {/* SUBMIT BUTTONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-[#8B278C] to-[#B673BF] text-white font-semibold rounded-xl hover:from-[#B673BF] hover:to-[#8B278C] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {editingId ? '💾 Cập Nhật' : '➕ Thêm Phụ Kiện'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-[#B673BF] text-[#8B278C] font-semibold rounded-xl hover:bg-[#F2D8EE] transition-all duration-200"
              >
                ❌ Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ACCESSORIES LIST */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-[#D2A0D9] bg-gradient-to-r from-[#8B278C] to-[#B673BF]">
          <h2 className="text-2xl font-bold text-white">
            📦 Danh Sách Phụ Kiện ({accessories.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F2D8EE]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Hình Ảnh
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Tên & Mô Tả
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Danh Mục
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Tương Thích
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Tình Trạng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F2D8EE]">
              {accessories.map((accessory) => {
                // 🔥 FIXED: Parse compatible_with đúng cách
                let compatibleBikes: number[] = [];
                try {
                  if (accessory.compatible_with && accessory.compatible_with.trim() !== '') {
                    compatibleBikes = JSON.parse(accessory.compatible_with);
                    if (!Array.isArray(compatibleBikes)) {
                      compatibleBikes = [];
                    }
                  }
                } catch (error) {
                  console.error('Error parsing compatible_with:', accessory.compatible_with);
                  compatibleBikes = [];
                }
                  
                return (
                  <tr key={accessory.id} className="hover:bg-[#F2D8EE] transition-colors duration-200">
                    <td className="px-6 py-4">
                      {accessory.image_url ? (
                        <div className="flex justify-center">
                          <img
                            src={accessory.image_url}
                            alt={accessory.name}
                            className="w-16 h-16 object-cover rounded-lg border-2 border-[#D2A0D9] shadow-sm"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-[#F2D8EE] rounded-lg flex items-center justify-center border-2 border-dashed border-[#B673BF]">
                          <span className="text-[#B673BF] text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-base font-semibold text-[#8B278C]">{accessory.name}</div>
                      {accessory.description && (
                        <div className="text-sm text-gray-600 mt-1 max-w-xs">
                          {accessory.description.length > 100 
                            ? `${accessory.description.substring(0, 100)}...` 
                            : accessory.description
                          }
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-[#8B278C]">
                        {new Intl.NumberFormat('vi-VN').format(accessory.price)}₫
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#F2D8EE] text-[#8B278C] border border-[#D2A0D9]">
                        {accessory.category || 'Khác'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {compatibleBikes.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {compatibleBikes.slice(0, 3).map((bikeId: number) => {
                            const bikeType = BIKE_TYPES.find(bike => bike.id === bikeId);
                            return (
                              <span
                                key={bikeId}
                                className="px-2 py-1 bg-[#8B278C] text-white text-xs rounded-full font-medium"
                              >
                                {bikeType?.display || `ID:${bikeId}`}
                              </span>
                            );
                          })}
                          {compatibleBikes.length > 3 && (
                            <span className="px-2 py-1 bg-[#B673BF] text-white text-xs rounded-full font-medium">
                              +{compatibleBikes.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <td className="px-6 py-4">
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F2D8EE] text-[#8B278C] border border-[#D2A0D9]">
    {accessory.in_stock} cái
  </span>
</td>

                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(accessory)}
                          className="px-3 py-1 bg-[#8B278C] text-white text-sm rounded-lg hover:bg-[#B673BF] transition-colors duration-200"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(accessory.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {accessories.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-[#8B278C] mb-2">Chưa có phụ kiện nào</h3>
            <p className="text-[#B673BF]">Hãy thêm phụ kiện đầu tiên của bạn!</p>
          </div>
        )}
      </div>
    </div>
  );
}
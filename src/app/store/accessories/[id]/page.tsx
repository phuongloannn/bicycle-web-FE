// src/app/store/accessories/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// 🔥 ĐỊNH NGHĨA TYPE CHO ACCESSORY
interface Accessory {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  compatible_with: string;
  in_stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// 🔥 API SERVICE
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const AccessoryService = {
  async getAccessory(id: number): Promise<Accessory> {
    const response = await fetch(`${API_BASE_URL}/api/accessories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch accessory');
    return response.json();
  },

  async getAccessories(): Promise<Accessory[]> {
    const response = await fetch(`${API_BASE_URL}/api/accessories`);
    if (!response.ok) throw new Error('Failed to fetch accessories');
    return response.json();
  }
};

// 🔥 DANH SÁCH LOẠI XE TƯƠNG THÍCH
const BIKE_TYPES = [
  { id: 1, name: "Road Bike", display: "Xe Đua Road" },
  { id: 2, name: "Mountain Bike", display: "Xe Địa Hình" },
  { id: 3, name: "Touring Bike", display: "Xe Du Lịch" },
  { id: 4, name: "Hybrid Bike", display: "Xe Lai" },
  { id: 5, name: "City Bike", display: "Xe Đô Thị" },
  { id: 6, name: "Kids Bike", display: "Xe Trẻ Em" }
];

export default function AccessoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accessoryId = parseInt(params.id as string);

  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [relatedAccessories, setRelatedAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // 🔥 ADD TO CART (TẠM THỜI - GIỐNG TRANG LIST)
  const handleAddToCart = async () => {
    if (!accessory) return;
    
    try {
      // 🔥 TẠM THỜI: Hiển thị thông báo
      alert(`Đã thêm ${quantity} "${accessory.name}" vào giỏ hàng!\n\nTổng: ${(accessory.price * quantity).toLocaleString('vi-VN')}₫`);
      
      console.log('🛒 Add to cart:', {
        accessoryId: accessory.id,
        name: accessory.name,
        quantity: quantity,
        total: accessory.price * quantity
      });
    } catch (error) {
      console.error('❌ Lỗi khi thêm vào giỏ:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
  };

  // 🔥 XỬ LÝ URL ẢNH
  const processImageUrl = (url: string | null): string => {
    if (!url) return '/images/placeholder-product.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
    return '/images/placeholder-product.jpg';
  };

  // 🔥 LOAD ACCESSORY DATA
  useEffect(() => {
    async function loadAccessoryData() {
      try {
        console.log('🔄 Loading accessory detail:', accessoryId);
        const accessoryData = await AccessoryService.getAccessory(accessoryId);
        console.log('✅ Loaded accessory:', accessoryData);
        
        setAccessory(accessoryData);

        // Load related accessories (same category)
        const allAccessories = await AccessoryService.getAccessories();
        const related = allAccessories
          .filter(a => a.category === accessoryData.category && a.id !== accessoryId)
          .slice(0, 4);
        
        setRelatedAccessories(related);
      } catch (error) {
        console.error('⚠️ Failed to load accessory:', error);
        router.push('/store/accessories');
      } finally {
        setLoading(false);
      }
    }

    if (accessoryId) {
      loadAccessoryData();
    }
  }, [accessoryId, router]);

  // 🔥 CHECK IMAGE
  useEffect(() => {
    if (accessory) {
      const imageUrl = processImageUrl(accessory.image_url);
      console.log('🔍 Image URL:', imageUrl);
      
      if (imageUrl && imageUrl !== '/images/placeholder-product.jpg') {
        setImageStatus('success');
      } else {
        setImageStatus('error');
      }
    }
  }, [accessory]);

  // 🔥 GET COMPATIBLE BIKES
  const getCompatibleBikes = () => {
    if (!accessory?.compatible_with) return [];
    try {
      return JSON.parse(accessory.compatible_with);
    } catch {
      return [];
    }
  };

  const compatibleBikes = getCompatibleBikes();
  const isInStock = accessory && accessory.in_stock === 1;
  const mainImageUrl = accessory ? processImageUrl(accessory.image_url) : '';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-64">
        <div className="text-lg">Đang tải thông tin phụ kiện...</div>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p className="text-lg mb-4">Không tìm thấy phụ kiện.</p>
        <Link href="/store/accessories" className="text-blue-600 hover:text-blue-700">
          ← Quay lại danh sách phụ kiện
        </Link>
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
          <li><span className="text-gray-400">/</span></li>
          <li>
            <Link href="/store/accessories" className="text-gray-400 hover:text-gray-500">
              Phụ Kiện
            </Link>
          </li>
          <li><span className="text-gray-400">/</span></li>
          <li><span className="text-gray-900 font-medium">{accessory.name}</span></li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* ẢNH PHỤ KIỆN */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="h-96 bg-gray-100 flex items-center justify-center relative">
            {imageStatus === 'loading' && (
              <div className="text-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div>Đang tải ảnh...</div>
              </div>
            )}
            {imageStatus === 'success' && (
              <img
                src={mainImageUrl}
                alt={accessory.name}
                className="w-full h-full object-cover"
                onLoad={() => setImageStatus('success')}
                onError={() => {
                  console.log('🖼️ Image load error:', mainImageUrl);
                  setImageStatus('error');
                }}
              />
            )}
            {imageStatus === 'error' && (
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">📷</div>
                <div className="text-lg font-semibold">Không có ảnh</div>
              </div>
            )}
          </div>
        </div>

        {/* THÔNG TIN PHỤ KIỆN */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{accessory.name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold text-blue-600">
              {accessory.price.toLocaleString('vi-VN')}₫
            </span>
            <span className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
              isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isInStock ? 'Còn hàng' : 'Hết hàng'}
            </span>
          </div>

          {/* DANH MỤC */}
          {accessory.category && (
            <Link
              href={`/store/accessories?category=${encodeURIComponent(accessory.category)}`}
              className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200"
            >
              {accessory.category}
            </Link>
          )}

          {/* LOẠI XE TƯƠNG THÍCH */}
          {compatibleBikes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Phù hợp với</h3>
              <div className="flex flex-wrap gap-2">
                {compatibleBikes.map((bikeId: number) => (
                  <span
                    key={bikeId}
                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {BIKE_TYPES.find(bike => bike.id === bikeId)?.display}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* MÔ TẢ */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h3>
            <p className="text-gray-600 whitespace-pre-line">{accessory.description}</p>
          </div>

          {/* SỐ LƯỢNG & NÚT GIỎ HÀNG */}
          {isInStock && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100" 
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300"
              >
                Thêm vào giỏ hàng - {(accessory.price * quantity).toLocaleString('vi-VN')}₫
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PHỤ KIỆN LIÊN QUAN */}
      {relatedAccessories.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Phụ kiện liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedAccessories.map((relatedAccessory) => {
              const relatedImageUrl = processImageUrl(relatedAccessory.image_url);
              const relatedCompatibleBikes = relatedAccessory.compatible_with 
                ? JSON.parse(relatedAccessory.compatible_with)
                : [];

              return (
                <Link 
                  key={relatedAccessory.id} 
                  href={`/store/accessories/${relatedAccessory.id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <img 
                      src={relatedImageUrl} 
                      alt={relatedAccessory.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedAccessory.name}
                    </h3>
                    
                    {/* Compatible Bikes Badge */}
                    {relatedCompatibleBikes.length > 0 && (
                      <div className="mb-2">
                        <div className="flex flex-wrap gap-1">
                          {relatedCompatibleBikes.slice(0, 2).map((bikeId: number) => (
                            <span
                              key={bikeId}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                              {BIKE_TYPES.find(bike => bike.id === bikeId)?.display}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-blue-600 font-bold">
                      {relatedAccessory.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
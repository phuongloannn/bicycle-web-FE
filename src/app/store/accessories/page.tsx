'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from "./../../../contexts/CartContext";

// 🔥 ĐỊNH NGHĨA TYPE CHO ACCESSORY
interface Accessory {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  compatible_with: string; // JSON string: "[1,3,5]"
  in_stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// 🔥 API SERVICE CHO ACCESSORIES
const AccessoryService = {
  async getAccessories(): Promise<Accessory[]> {
    const response = await fetch('http://localhost:3000/api/accessories');
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

export default function AccessoriesStorePage() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [filteredAccessories, setFilteredAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBikeType, setSelectedBikeType] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  // 🔥 FETCH ACCESSORIES
  useEffect(() => {
    async function loadAccessories() {
      try {
        const data = await AccessoryService.getAccessories();
        console.log('data', data);
        setAccessories(data);
        setFilteredAccessories(data);
      } catch (error) {
        console.error('❌ Failed to load accessories:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAccessories();
  }, []);

  // 🔥 FILTER ACCESSORIES
  useEffect(() => {
    let result = accessories;

    if (selectedBikeType !== 'all') {
      result = result.filter(accessory => {
        try {
          const compatibleWith: number[] = accessory.compatible_with
            ? JSON.parse(accessory.compatible_with)
            : [];
          return compatibleWith.includes(selectedBikeType);
        } catch {
          return false;
        }
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(accessory =>
        accessory.name.toLowerCase().includes(query) ||
        (accessory.description && accessory.description.toLowerCase().includes(query)) ||
        (accessory.category && accessory.category.toLowerCase().includes(query))
      );
    }

    setFilteredAccessories(result);
  }, [accessories, selectedBikeType, searchQuery]);

  // 🔥 ADD TO CART
  const handleAddToCart = async (accessory: Accessory) => {
    try {
      await addToCart({
        id: accessory.id,
        name: accessory.name,
        price: accessory.price,
        image: accessory.image_url,
        stock: accessory.in_stock
      }, 1, "accessory");

      alert(`Đã thêm ${accessory.name} vào giỏ hàng!`);
    } catch (error) {
      console.error('❌ Lỗi khi thêm vào giỏ:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
  };

  // 🔥 XỬ LÝ URL ẢNH
  const processImageUrl = (url: string | null): string => {
    if (!url) return '/images/placeholder-product.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) return `http://localhost:3000${url}`;
    return '/images/placeholder-product.jpg';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg">Đang tải phụ kiện...</div>
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
            <span className="text-gray-900 font-medium">Phụ Kiện</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Phụ Kiện Xe Đạp
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Khám phá các phụ kiện chất lượng cao, phù hợp với mọi loại xe đạp
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Bike Type Filter */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Lọc theo loại xe
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBikeType('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                  selectedBikeType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất Cả
              </button>
              {BIKE_TYPES.map(bikeType => (
                <button
                  key={bikeType.id}
                  onClick={() => setSelectedBikeType(bikeType.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                    selectedBikeType === bikeType.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {bikeType.display}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="w-full lg:w-80">
            <input
              type="text"
              placeholder="Tìm kiếm phụ kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter Status */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredAccessories.length} phụ kiện
            {selectedBikeType !== 'all' && (
              <> phù hợp với <strong>{BIKE_TYPES.find(b => b.id === selectedBikeType)?.display}</strong></>
            )}
          </p>

          {(selectedBikeType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBikeType('all');
                setSearchQuery('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Accessories Grid */}
      {filteredAccessories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAccessories.map((accessory) => {
            let compatibleBikes: number[] = [];
            try {
              compatibleBikes = accessory.compatible_with
                ? JSON.parse(accessory.compatible_with)
                : [];
            } catch {}
            
            return (
              <div key={accessory.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                {/* Image */}
                <div className="aspect-w-16 aspect-h-12 bg-gray-100 overflow-hidden">
                  <img
                    src={processImageUrl(accessory.image_url)}
                    alt={accessory.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = '/images/placeholder-product.jpg'; }}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {accessory.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {accessory.description}
                  </p>

                  {/* Compatible Bikes */}
                  {compatibleBikes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Phù hợp với:</p>
                      <div className="flex flex-wrap gap-1">
                        {compatibleBikes.slice(0, 2).map((bikeId: number) => (
                          <span
                            key={bikeId}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {BIKE_TYPES.find(bike => bike.id === bikeId)?.display}
                          </span>
                        ))}
                        {compatibleBikes.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{compatibleBikes.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price & Stock */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-blue-600">
                        {accessory.price.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="text-sm text-gray-500">
                        {accessory.in_stock > 0
                          ? `Còn ${accessory.in_stock} sản phẩm`
                          : 'Hết hàng'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(accessory)}
                      disabled={accessory.in_stock <= 0}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition duration-300 ${
                        accessory.in_stock > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {accessory.in_stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                  </div>

                  {/* Category */}
                  {accessory.category && (
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {accessory.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy phụ kiện phù hợp
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            {selectedBikeType !== 'all' || searchQuery
              ? 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'
              : 'Hiện chưa có phụ kiện nào trong hệ thống.'}
          </p>
          {(selectedBikeType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBikeType('all');
                setSearchQuery('');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Xem tất cả phụ kiện
            </button>
          )}
        </div>
      )}
    </div>
  );
}

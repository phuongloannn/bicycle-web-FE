// src/app/store/product/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '../../../../types/store';
import { StoreService } from '../../../../services/StoreService';
import { useCart } from "../../../../contexts/CartContext";

// 🔹 INTERFACE CHO THÔNG SỐ KỸ THUẬT
interface ProductSpecification {
  id: number;
  product_id: number;
  frame_size: string;
  wheel_size: string;
  gear_system: string;
  brake_type: string;
  weight: string;
  material: string;
  created_at: string;
  updated_at: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [specifications, setSpecifications] = useState<ProductSpecification | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [specLoading, setSpecLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { addToCart } = useCart();

  // 🔹 HÀM LẤY URL ẢNH
  const getImageUrl = (product: Product | null): string | null => {
    if (!product) return null;
    return product.image_url || product.imageUrl || product.image || product.photo || null;
  };

  // 🔹 XỬ LÝ URL ẢNH
  const processImageUrl = (url: string | null): string => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    if (!url) return '/images/placeholder-product.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
    return '/images/placeholder-product.jpg';
  };

  // 🧩 LOAD PRODUCT DATA VÀ SPECIFICATIONS
  useEffect(() => {
    async function loadProductData() {
      try {
        const storeService = new StoreService();
        const allProducts = await storeService.getProducts();
        const productData = allProducts.find(p => p.id === productId);

        if (!productData) throw new Error('Product not found');

        setProduct(productData);

        // 🧩 LOAD THÔNG SỐ KỸ THUẬT
        try {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
          const specResponse = await fetch(`${API_BASE_URL}/product-specifications/product/${productId}`);
          if (specResponse.ok) {
            const specData = await specResponse.json();
            setSpecifications(specData);
          }
        } catch (specError) {
          console.warn('Không thể tải thông số kỹ thuật:', specError);
        } finally {
          setSpecLoading(false);
        }

        const related = allProducts
          .filter(p => p.category === productData.category && p.id !== productId)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to load product:', error);
        router.push('/store/products');
      } finally {
        setLoading(false);
      }
    }

    if (productId) loadProductData();
  }, [productId, router]);

  // 🧩 CHECK IMAGE EXISTENCE
  useEffect(() => {
    if (product) {
      const imageUrl = processImageUrl(getImageUrl(product));
      if (imageUrl && imageUrl !== '/images/placeholder-product.jpg') {
        setImageStatus('success');
      } else {
        setImageStatus('error');
      }
    }
  }, [product]);

  // 🔹 ADD TO CART
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product, quantity);
      // Subtle success feedback instead of alert
      const button = document.getElementById('add-to-cart-btn');
      if (button) {
        button.textContent = '✓ Đã thêm vào giỏ';
        setTimeout(() => {
          button.textContent = 'Thêm vào giỏ hàng';
        }, 2000);
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ:', error);
    }
  };

  const isInStock = product && (product.stock > 0 || product.quantity > 0);
  const stockQuantity = product ? (product.stock || product.quantity || 0) : 0;
  const mainImageUrl = product ? processImageUrl(getImageUrl(product)) : '';

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Đang tải sản phẩm...</div>
        </div>
      </div>
    );
  }

  // 🔹 Not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</div>
          <Link 
            href="/store/products" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>← Quay lại danh sách</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link 
              href="/store" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              SportX
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/store" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Trang chủ
              </Link>
              <Link href="/store/products" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Sản phẩm
              </Link>
              <Link 
                href="/store/cart" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Giỏ hàng
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/store" className="hover:text-gray-700 transition-colors duration-200">Trang chủ</Link>
            </li>
            <li>→</li>
            <li>
              <Link href="/store/products" className="hover:text-gray-700 transition-colors duration-200">Sản phẩm</Link>
            </li>
            <li>→</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
              <div className="aspect-square relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                {imageStatus === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                    </div>
                  </div>
                )}
                {imageStatus === 'success' && (
                  <img
                    src={mainImageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onLoad={() => setImageStatus('success')}
                    onError={() => setImageStatus('error')}
                  />
                )}
                {imageStatus === 'error' && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <div className="text-sm">Không thể tải ảnh</div>
                    </div>
                  </div>
                )}
                
                {/* Stock Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm ${
                  isInStock 
                    ? 'bg-green-500/20 text-green-700 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-700 border border-red-500/30'
                }`}>
                  {isInStock ? 'Còn hàng' : 'Hết hàng'}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {Number(product.price).toLocaleString('vi-VN')} đ
                </span>
                {product.category && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Add to Cart Section */}
              {isInStock && (
                <div className="space-y-6 border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium text-lg">Số lượng:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 active:scale-95 disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 active:scale-95 disabled:opacity-50"
                        disabled={quantity >= stockQuantity}
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  
                  <button
                    id="add-to-cart-btn"
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 flex items-center justify-center gap-3"
                  >
                    <span>🛒</span>
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                </div>
              )}
            </div>

            {/* 🔥 THÔNG SỐ KỸ THUẬT CHI TIẾT */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-blue-600">⚙️</span>
                Thông số kỹ thuật
              </h2>

              {specLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : specifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cột 1 - Thông số cơ bản */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Kích thước khung</span>
                      <span className="text-gray-900 font-semibold">{specifications.frame_size}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Kích thước bánh xe</span>
                      <span className="text-gray-900 font-semibold">{specifications.wheel_size}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Hệ thống chuyển động</span>
                      <span className="text-gray-900 font-semibold">{specifications.gear_system}</span>
                    </div>
                  </div>

                  {/* Cột 2 - Thông số kỹ thuật */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Loại phanh</span>
                      <span className="text-gray-900 font-semibold">{specifications.brake_type}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Trọng lượng</span>
                      <span className="text-gray-900 font-semibold">{specifications.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Chất liệu</span>
                      <span className="text-gray-900 font-semibold">{specifications.material}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-3">🔧</div>
                  <p>Chưa có thông số kỹ thuật cho sản phẩm này</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedImageUrl = processImageUrl(getImageUrl(relatedProduct));
                return (
                  <Link 
                    key={relatedProduct.id} 
                    href={`/store/product/${relatedProduct.id}`}
                    className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img 
                        src={relatedImageUrl} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-product.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-blue-600 font-bold text-lg">
                        {Number(relatedProduct.price).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2024 SportX. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
}
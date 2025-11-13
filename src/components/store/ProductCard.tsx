// src/components/store/ProductCard.tsx - SỬA HOÀN TOÀN
'use client';
import Link from 'next/link';
import { Product } from '../../types/store';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();

  // DEBUG: Kiểm tra tất cả field ảnh
  console.log('🖼️ Product image fields for ID', product.id, ':', {
    image_url: product.image_url,
    imageUrl: product.imageUrl,
    image: product.image,
    photo: product.photo,
    photos: product.photos
  });

  // HÀM LẤY ẢNH - kiểm tra tất cả các field có thể
  const getImageUrl = (): string | null => {
    // Thứ tự ưu tiên các field ảnh
    if (product.image_url) return product.image_url;
    if (product.imageUrl) return product.imageUrl;
    if (product.image) return product.image;
    if (product.photo) return product.photo;
    if (product.photos && product.photos.length > 0) return product.photos[0];
    
    return null;
  };

  const imageUrl = getImageUrl();
  console.log('✅ Final image URL for product', product.id, ':', imageUrl);

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity: 1 }
    });
    alert('Đã thêm vào giỏ hàng!');
  };

  const isInStock = (product.stock > 0 || product.quantity > 0);
  const stockQuantity = product.stock || product.quantity || 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <Link href={`/store/product/${product.id}`}>
        <div className="h-48 bg-gray-200 cursor-pointer relative">
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('❌ IMAGE LOAD ERROR for product', product.id, 'URL:', imageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          
          {/* Placeholder - hiển thị khi không có ảnh hoặc ảnh lỗi */}
          <div className={`w-full h-full flex items-center justify-center text-gray-500 ${imageUrl ? '' : ''}`}>
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <div className="text-sm">No Image</div>
              <div className="text-xs text-gray-400 mt-1">ID: {product.id}</div>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/store/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-blue-600">
            {typeof product.price === 'string' 
              ? parseFloat(product.price).toLocaleString('vi-VN') 
              : product.price.toLocaleString('vi-VN')} đ
          </span>
          <span className={`text-sm ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
            {isInStock ? `Còn ${stockQuantity}` : 'Hết hàng'}
          </span>
        </div>
        
        <button
          onClick={addToCart}
          disabled={!isInStock}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-300 ${
            isInStock 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isInStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
}
// src/components/store/ProductCard.tsx
'use client';

import Link from 'next/link';
import { Product } from '../../types/store';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number | string) => {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  return value.toLocaleString('vi-VN') + ' ₫';
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const getImageUrl = (): string | null => {
    return (
      product.image_url ||
      product.imageUrl ||
      product.image ||
      (product.photos && product.photos[0]) ||
      null
    );
  };

  const handleBuyNow = async () => {
    await addToCart(product, 1, 'product');
    window.location.href = "/store/cart";
  };

  const imageUrl = getImageUrl();
  const isInStock = product.stock > 0 || product.quantity > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">

      {/* IMAGE */}
      <Link href={`/store/product/${product.id}`}>
        <div className="h-48 bg-gray-200 relative flex items-center justify-center">

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("❌ Image load failed:", imageUrl);
                e.currentTarget.src = "/images/placeholder-bike.jpg"; // fallback ảnh chuẩn
              }}
            />
          ) : (
            <img
              src="/images/placeholder-bike.jpg"
              alt="No Image"
              className="w-full h-full object-cover"
            />
          )}

        </div>
      </Link>

      <div className="p-4">
        <Link href={`/store/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>

          <span className={`text-sm ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
            {isInStock ? 'Còn hàng' : 'Hết hàng'}
          </span>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={!isInStock}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-300 ${
            isInStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Mua ngay
        </button>

      </div>
    </div>
  );
}

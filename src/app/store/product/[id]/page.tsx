// src/app/store/product/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '../../../../types/store';
import { StoreService } from '../../../../services/StoreService';
import { useCart } from '../../../../contexts/CartContext';

// ⭐ Kiểu dữ liệu cho Review
interface ProductReview {
  user: string;
  rating: number; // 1–5
  comment: string;
  date: string; // YYYY-MM-DD
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { addToCart } = useCart();

  // ⭐ STATE REVIEW
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [userReview, setUserReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);

  // 🔹 HÀM LẤY URL ẢNH
  const getImageUrl = (product: Product | null): string | null => {
    if (!product) return null;

    if (product.image_url) return product.image_url;
    if (product.imageUrl) return product.imageUrl;
    if (product.image) return product.image;
    if (product.photo) return product.photo;
    if (product.photos && product.photos.length > 0) return product.photos[0];

    return null;
  };

  // 🔹 XỬ LÝ URL ẢNH
  const processImageUrl = (url: string | null): string => {
    if (!url) return '/images/placeholder-product.jpg';

    if (url.startsWith('http')) {
      return url;
    }

    if (url.startsWith('/uploads/')) {
      return `http://localhost:3000${url}`;
    }

    return '/images/placeholder-product.jpg';
  };

  // 🧩 USE EFFECT 1: Load product data
  useEffect(() => {
    async function loadProductData() {
      try {
        setLoading(true);
        const storeService = new StoreService();
        const allProducts = await storeService.getProducts();
        const productData = allProducts.find((p) => p.id === productId);

        if (!productData) throw new Error('Product not found');

        console.log('✅ Loaded product:', productData);
        setProduct(productData);

        const related = allProducts
          .filter((p) => p.category === productData.category && p.id !== productId)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('⚠️ Failed to load product:', error);
        router.push('/store/products');
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProductData();
    }
  }, [productId, router]);

  // 🧩 USE EFFECT 2: Check image existence
  useEffect(() => {
    if (product) {
      const imageUrl = processImageUrl(getImageUrl(product));
      console.log('🔍 Image URL:', imageUrl);

      if (imageUrl && imageUrl !== '/images/placeholder-product.jpg') {
        setImageStatus('success');
      } else {
        setImageStatus('error');
      }
    }
  }, [product]);

  // 🧩 USE EFFECT 3: Fake reviews + check purchased
  useEffect(() => {
    if (!product) return;

    // ⭐ Dummy reviews để demo
    const dummyReviews: ProductReview[] = [
      {
        user: 'Nguyễn Văn A',
        rating: 5,
        comment: 'Sản phẩm rất tốt, chất lượng vượt mong đợi!',
        date: '2024-01-12',
      },
      {
        user: 'Trần Thị B',
        rating: 4,
        comment: 'Hàng đúng mô tả, giao nhanh, đóng gói cẩn thận.',
        date: '2024-02-03',
      },
    ];

    setReviews(dummyReviews);

    // TODO: sau này check từ backend xem user có order chứa productId hay không
    setHasPurchased(true); // Tạm thời: giả lập là đã mua sản phẩm
  }, [product]);

  // 🔹 ADD TO CART
  const handleAddToCart = async () => {
    if (!product) return;

    console.log('🛒 [ProductPage] Adding to cart:', {
      productId: product.id,
      productName: product.name,
      imageUrl: product.image || product.imageUrl || product.image_url,
      quantity: quantity,
    });

    try {
      await addToCart(product, quantity);
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } catch (error) {
      console.error('❌ Lỗi khi thêm vào giỏ:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
  };

  // ⭐ GỬI REVIEW
  const handleSubmitReview = () => {
    if (!rating || !userReview.trim()) {
      alert('Vui lòng chọn số sao và nhập nội dung review!');
      return;
    }

    const newReview: ProductReview = {
      user: 'Bạn',
      rating,
      comment: userReview.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([newReview, ...reviews]);
    setUserReview('');
    setRating(0);
    alert('Cảm ơn bạn đã đánh giá sản phẩm!');
  };

  const isInStock = product && (product.stock > 0 || product.quantity > 0);
  const stockQuantity = product ? product.stock || product.quantity || 0 : 0;
  const mainImageUrl = product ? processImageUrl(getImageUrl(product)) : '';

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-64">
        <div className="text-lg">Đang tải sản phẩm...</div>
      </div>
    );
  }

  // 🔹 Not found
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p className="text-lg mb-4">Không tìm thấy sản phẩm.</p>
        <Link href="/store/products" className="text-blue-600 hover:text-blue-700">
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  // ✅ UI chính
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
            <Link href="/store/products" className="text-gray-400 hover:text-gray-500">
              Sản phẩm
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* ẢNH SẢN PHẨM */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="h-96 bg-gray-200 flex items-center justify-center relative">
            {imageStatus === 'loading' && (
              <div className="text-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div>Đang tải ảnh...</div>
              </div>
            )}
            {imageStatus === 'success' && (
              <img
                src={mainImageUrl}
                alt={product.name}
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
                <div className="text-lg font-semibold">Không thể tải ảnh</div>
                <div className="text-sm mt-2">Product ID: {product.id}</div>
                <div className="text-xs mt-1 text-gray-400">
                  <a
                    href={mainImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {mainImageUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 bg-gray-100 border-t text-xs text-gray-600">
            <strong>Image Status:</strong> {imageStatus}
            <div className="mt-1 break-all">
              <strong>URL:</strong> {mainImageUrl}
            </div>
          </div>
        </div>

        {/* THÔNG TIN SẢN PHẨM */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold text-blue-600">
              {Number(product.price).toLocaleString('vi-VN')} đ
            </span>
            <span
              className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {isInStock ? `Còn ${stockQuantity} sản phẩm` : 'Hết hàng'}
            </span>
          </div>
          {product.category && (
            <Link
              href={`/store/categories/${encodeURIComponent(product.category)}`}
              className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200"
            >
              {product.category}
            </Link>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h3>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
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
                    onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity >= stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ⭐ REVIEW SECTION */}
      <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>

        {/* FORM GỬI REVIEW – chỉ hiển thị nếu hasPurchased = true */}
        {hasPurchased ? (
          <div className="mb-10 p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Viết đánh giá của bạn</h3>

            {/* Rating stars */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl ${
                    rating >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="Nhập cảm nhận về sản phẩm..."
              className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />

            <button
              type="button"
              onClick={handleSubmitReview}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Gửi đánh giá
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mb-6 italic">
            *Bạn cần mua sản phẩm này để gửi đánh giá.
          </p>
        )}

        {/* DANH SÁCH REVIEW */}
        <div className="space-y-6">
          {reviews.length === 0 && (
            <p className="text-gray-500">Chưa có đánh giá nào.</p>
          )}

          {reviews.map((review, index) => (
            <div key={index} className="border rounded-lg p-5 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold">{review.user}</h4>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>

              <div className="flex text-yellow-400 text-lg my-1">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>

              <p className="text-gray-700 mt-1">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SẢN PHẨM LIÊN QUAN */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => {
              const relatedImageUrl = processImageUrl(getImageUrl(relatedProduct));
              return (
                <Link
                  key={relatedProduct.id}
                  href={`/store/product/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <img
                      src={relatedImageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-blue-600 font-bold">
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
  );
}

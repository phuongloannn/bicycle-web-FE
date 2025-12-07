// src/app/store/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../types/store';
import { StoreService } from '../../services/StoreService';
import ProductCard from '../../components/store/ProductCard';
import CustomerChatWidget from '../../components/chatbot/ChatbotWidget';
import { useCart } from '../../contexts/CartContext';

// ⭐ Format giá chuẩn VN theo yêu cầu
const formatPrice = (price: number | string) => {
  const p = typeof price === "string" ? parseFloat(price) : price;
  return p.toLocaleString("vi-VN") + " ₫";
};

// ⭐ Lấy ảnh an toàn
function getProductImage(p: any) {
  return (
    p.image ||
    p.imageUrl ||
    p.image_url ||
    (p.photos && p.photos[0]) ||
    "/images/placeholder-bike.jpg"
  );
}

export default function StoreHomePage() {
  const { addToCart } = useCart();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);

  // 🔥 Load Products + Categories
  useEffect(() => {
    async function fetchData() {
      try {
        const storeService = new StoreService();
        const [products, categoriesData] = await Promise.all([
          storeService.getProducts(),
          storeService.getCategories(),
        ]);

        setFeaturedProducts(products.slice(0, 8));
        setTopProducts(products.slice(0, 3)); // Slider 3 SP
        setCategories(categoriesData.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ⭐ Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add("animate-fade-in-up");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [featuredProducts, categories]);

  // ⭐ Auto Slider
  useEffect(() => {
    if (topProducts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveFeaturedIndex(prev => (prev + 1) % topProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [topProducts]);

  // ⭐ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 animate-spin rounded-full mx-auto"></div>
          <p className="text-gray-700 mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* ========================= HERO ========================= */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative py-8">
        <div className="absolute inset-0 bg-grid-gray-200/[0.02] bg-[size:60px_60px]" />

        <div className="w-full max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-8 animate-on-scroll opacity-0 -translate-x-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              THƯƠNG HIỆU THỂ THAO CAO CẤP
            </div>

            <h1 className="text-5xl font-black text-gray-900">
              Q-SPORTS
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500">
                PERFORMANCE
              </span>
            </h1>

            <p className="text-gray-600 text-lg">
              Nâng tầm hiệu suất với công nghệ tiên tiến. Thiết kế tối giản, chất liệu cao cấp.
            </p>

            <div className="flex gap-4">
              <Link href="/store/products" className="bg-gray-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800">
                MUA SẮM NGAY
              </Link>
              <Link href="/store/about" className="border-2 border-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-900 hover:text-white">
                VỀ CHÚNG TÔI
              </Link>
            </div>
          </div>

          <div className="relative animate-on-scroll opacity-0 translate-x-8">
            <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
              <div className="w-full h-[400px] relative bg-gray-100">
                <Image
                  src="/images/q-sports-collection.jpg"
                  alt="Q-Sports Collection"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= SLIDER ========================= */}
      {topProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">

            {(() => {
              const p = topProducts[activeFeaturedIndex];
              if (!p) return null;

              return (
                <div className="grid md:grid-cols-2 gap-12 items-center animate-fade">

                  <div className="space-y-3">
                    <p className="text-blue-600 text-sm font-bold">{p.category}</p>
                    <h2 className="text-4xl font-extrabold">{p.name}</h2>
                    <p className="text-gray-600">{p.description}</p>

                    {/* ⭐ FORMAT GIÁ */}
                    <p className="text-3xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(p.price)}
                    </p>

                    <div className="flex gap-4 pt-4">
                      
                      {/* ⭐ MUA NGAY → GIỎ HÀNG */}
                      <button
                        onClick={() => {
                          addToCart(p, 1, "product");
                          window.location.href = "/store/cart";
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        MUA NGAY
                      </button>

                      <Link
                        href={`/store/product/${p.id}`}
                        className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                      >
                        XEM CHI TIẾT
                      </Link>
                    </div>
                  </div>

                  {/* IMAGE */}
                  <div className="relative h-[360px] rounded-3xl shadow-xl overflow-hidden bg-white group">

                    <Image
                      src={getProductImage(p)}
                      alt={p.name}
                      fill
                      className="object-contain p-6 group-hover:scale-105 transition-transform"
                    />

                    <button
                      onClick={() =>
                        setActiveFeaturedIndex((prev) => (prev - 1 + topProducts.length) % topProducts.length)
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 w-10 h-10 rounded-full shadow"
                    >
                      ‹
                    </button>

                    <button
                      onClick={() =>
                        setActiveFeaturedIndex((prev) => (prev + 1) % topProducts.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 w-10 h-10 rounded-full shadow"
                    >
                      ›
                    </button>

                  </div>

                </div>
              );
            })()}

            {/* DOTS */}
            <div className="flex justify-center mt-6 gap-2">
              {topProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFeaturedIndex(i)}
                  className={`w-3 h-3 rounded-full transition ${
                    activeFeaturedIndex === i ? "bg-blue-600 w-6" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================= DANH MỤC ========================= */}
      {categories.length > 0 && (
        <section className="py-20 bg-white px-6">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8">
              <h2 className="text-4xl font-black">DANH MỤC NỔI BẬT</h2>
              <p className="text-gray-600">Khám phá các bộ sưu tập ưu tiên.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, idx) => (
                <Link
                  key={idx}
                  href={`/store/categories/${encodeURIComponent(category)}`}
                  className="group bg-white border rounded-2xl shadow p-8 text-center hover:-translate-y-1 hover:shadow-lg transition"
                >
                  <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                    👕
                  </div>
                  <h3 className="text-xl font-bold">{category}</h3>
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 mt-2">
                    Khám phá ngay →
                  </p>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ========================= SẢN PHẨM ========================= */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-black">SẢN PHẨM NỔI BẬT</h2>
            <p className="text-gray-600">Hiệu suất cho vận động viên.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/store/products" className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800">
              XEM TẤT CẢ SẢN PHẨM
            </Link>
          </div>

        </div>
      </section>

      {/* ========================= NEWSLETTER ========================= */}
      <section className="py-20 bg-gray-900 text-white px-6">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-4xl font-black mb-6">ĐĂNG KÝ NHẬN THÔNG TIN</h2>
          <p className="text-gray-300 mb-10">Ưu đãi đặc biệt mỗi tuần.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">

            {/* ⭐ FIX INPUT QUÁ TỐI */}
            <input
            type="email"
            placeholder="Email của bạn..."
            className={`
              flex-1 px-4 py-3 rounded-lg
              bg-gray-800 text-white
              border border-white
              placeholder-white
              focus:outline-none focus:border-blue-400
              `}
            />


            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-200">
              ĐĂNG KÝ
            </button>
          </div>

        </div>
      </section>

      <CustomerChatWidget />

      {/* ========================= CSS ========================= */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp .6s ease-out forwards; }
        .bg-grid-gray-200\\/\\[0\\.02\\] {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(229 231 235 / 0.02)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>

    </div>
  );
}

// src/app/store/page.tsx 
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '../../types/store';
import { StoreService } from '../../services/StoreService';
import ProductCard from '../../components/store/ProductCard';
import Image from 'next/image';

// ⭐ THÊM IMPORT SLIDER
import FeaturedSlider from '@/components/store/FeaturedSlider';

export default function StoreHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const storeService = new StoreService();
        const [products, categoriesData] = await Promise.all([
          storeService.getProducts(),
          storeService.getCategories()
        ]);
        
        setFeaturedProducts(products.slice(0, 8));
        setCategories(categoriesData.slice(0, 6));
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  // Animation effects
useEffect(() => {
  const timeout = setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0');
          entry.target.classList.remove('translate-y-8');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    (window as any).__observer = observer;
  }, 0);

  return () => {
    clearTimeout(timeout);
    const obs = (window as any).__observer;
    if (obs) obs.disconnect();
  };
}, [categories, featuredProducts]);


useEffect(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        entry.target.classList.remove('opacity-0');
        entry.target.classList.remove('translate-y-8');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  return () => observer.disconnect(); // không còn lỗi
}, [categories, featuredProducts]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-lg font-medium text-gray-700 mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden py-8 lg:py-0">
        <div className="absolute inset-0 bg-grid-gray-200/[0.02] bg-[size:60px_60px]"></div>
        
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* LEFT */}
            <div className="space-y-8 animate-on-scroll opacity-0 transform translate-x-[-50px]">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                THƯƠNG HIỆU THỂ THAO CAO CẤP
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight">
                <span className="block">Q-SPORTS</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                  PERFORMANCE
                </span>
              </h1>

              <p className="text-lg text-gray-600 max-w-lg">
                Nâng tầm hiệu suất với công nghệ tiên tiến. Thiết kế tối giản, chất liệu cao cấp.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link 
                  href="/store/products" 
                  className="bg-gray-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition text-center"
                >
                  MUA SẮM NGAY →
                </Link>
                
                <Link 
                  href="/store/about" 
                  className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-900 hover:text-white transition text-center"
                >
                  VỀ CHÚNG TÔI
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative animate-on-scroll opacity-0 transform translate-x-[50px]">
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto border border-gray-200">
                <div className="w-full h-[400px] relative bg-gray-100">
                  <Image
                    src="/images/q-sports-collection.jpg"
                    alt="Q-SPORTS Collection"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ⭐⭐⭐ ADD SLIDER HERE ⭐⭐⭐ */}
      <FeaturedSlider />

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="py-20 lg:py-24 px-6 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                DANH MỤC NỔI BẬT
              </h2>
              <p className="text-lg text-gray-600">
                Khám phá các bộ sưu tập chuyên biệt cho từng môn thể thao
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {categories.map((category, index) => (
                <Link 
                  key={index} 
                  href={`/store/categories/${encodeURIComponent(category)}`}
                  className="group animate-on-scroll opacity-0 translate-y-8"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:-translate-y-2 transition border border-gray-100">
                    <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                      👕
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

{/* Nếu không có categories */}
{categories.length === 0 && !loading && (
  <section className="py-20 text-center text-gray-500">
    <h2 className="text-2xl font-bold mb-4">Không có danh mục nào để hiển thị</h2>
  </section>
)}

      {/* Featured Products Section */}
      <section className="py-20 lg:py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            SẢN PHẨM NỔI BẬT
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Thiết kế tối ưu cho hiệu suất vận động
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-on-scroll opacity-0 translate-y-8"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="text-center animate-on-scroll">
              <Link 
                href="/store/products" 
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition"
              >
                XEM TẤT CẢ →
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">Đang cập nhật sản phẩm...</div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-black mb-6">ĐĂNG KÝ NHẬN THÔNG TIN</h2>
          <p className="text-gray-300 mb-10">Nhận ưu đãi và sản phẩm mới</p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Email của bạn..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
            />
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold">
              ĐĂNG KÝ
            </button>
          </div>
        </div>
      </section>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .bg-grid-gray-200\\/\\[0\\.02\\] {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(229 231 235 / 0.02)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}

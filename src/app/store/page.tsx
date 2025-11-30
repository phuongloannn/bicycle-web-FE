// src/app/store/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '../../types/store';
import { StoreService } from '../../services/StoreService';
import ProductCard from '../../components/store/ProductCard';
import Image from 'next/image';

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
// Animation effects
useEffect(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Thêm animation class
        entry.target.classList.add('animate-fade-in-up');
        // Bỏ các class ẩn mặc định
        entry.target.classList.remove('opacity-0', 'translate-y-8');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  return () => observer.disconnect();
}, [featuredProducts, categories]);


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
      {/* Hero Section với ảnh thực tế */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden py-8 lg:py-0">
        <div className="absolute inset-0 bg-grid-gray-200/[0.02] bg-[size:60px_60px]"></div>
        
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Brand Information Side */}
            <div className="space-y-8 animate-on-scroll opacity-0 transform translate-x-[-50px]">
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium mb-4">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                  THƯƠNG HIỆU THỂ THAO CAO CẤP
                </div>
                
                {/* Main Title */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight break-words">
                    <span className="block tracking-tight">Q-SPORTS</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 tracking-tight">
                      PERFORMANCE
                    </span>
                  </h1>
                  
                  {/* Description */}
                  <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg lg:max-w-xl break-words">
                    Nâng tầm hiệu suất với công nghệ tiên tiến. 
                    Thiết kế tối giản, chất liệu cao cấp cho mọi vận động viên.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 lg:gap-8 pt-6 border-t border-gray-200">
                  {[
                    { number: '12K+', label: 'Vận Động Viên' },
                    { number: '50+', label: 'Giải Đấu' },
                    { number: '99%', label: 'Hài Lòng' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                      <div className="text-xs lg:text-sm text-gray-500 leading-tight px-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link 
                  href="/store/products" 
                  className="group relative bg-gray-900 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105 shadow-lg text-center flex-1"
                >
                  <span className="relative flex items-center justify-center">
                    MUA SẮM NGAY
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                
                <Link 
                  href="/store/about" 
                  className="group border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:bg-gray-900 hover:text-white text-center flex-1"
                >
                  <span className="flex items-center justify-center">
                    VỀ CHÚNG TÔI
                    <svg className="ml-2 w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Image Side với ảnh thực tế - ĐÃ SỬA LỖI MẤT ĐẦU */}
            <div className="relative animate-on-scroll opacity-0 transform translate-x-[50px]">
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md lg:max-w-lg mx-auto border border-gray-200">
                {/* Ảnh thực tế - SỬA LỖI MẤT ĐẦU */}
                <div className="w-full h-[400px] relative bg-gray-100">
                  <Image
                    src="/images/q-sports-collection.jpg"
                    alt="Q-SPORTS Collection 2024"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Overlay text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white w-full">
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4">
                        <p className="text-xl font-bold mb-1">Q-SPORTS Collection</p>
                        <p className="text-gray-200">Performance Wear 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-12 border border-gray-200">
                  <span className="text-xl">⚡</span>
                </div>
                <div className="absolute top-4 left-4 w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-lg flex items-center justify-center transform -rotate-6">
                  <span className="text-xs font-bold text-center leading-tight">NEW<br/>2025</span>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute -z-10 top-3 right-3 w-full h-full bg-gray-900 rounded-3xl transform rotate-2 max-w-md lg:max-w-lg mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-600 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="py-20 lg:py-24 px-6 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30"></div>
          
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 lg:mb-20 animate-on-scroll opacity-0 transform translate-y-8">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 break-words px-4">
                DANH MỤC NỔI BẬT
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá các bộ sưu tập chuyên biệt cho từng môn thể thao
              </p>
            </div>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {categories.map((category, index) => (
                <Link 
                  key={index} 
                  href={`/store/categories/${encodeURIComponent(category)}`}
                  className="group animate-on-scroll opacity-0 transform translate-y-8"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setActiveCategory(category)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className="relative bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-500 group-hover:shadow-2xl transform group-hover:-translate-y-2 border border-gray-100 group-hover:border-gray-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-500 shadow-lg">
                        <span className="text-2xl text-white">👕</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300 break-words">
                        {category}
                      </h3>
                      
                      <div className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Khám phá ngay
                        <svg className="inline-block ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-16 animate-on-scroll opacity-0 transform translate-y-8">
              <Link 
                href="/store/categories" 
                className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:bg-gray-800 hover:scale-105 group shadow-lg"
              >
                <span>XEM TẤT CẢ DANH MỤC</span>
                <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-20 lg:py-24 px-6 bg-gray-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 lg:mb-20 animate-on-scroll opacity-0 transform translate-y-8">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 break-words">
              SẢN PHẨM NỔI BẬT
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những thiết kế tối ưu cho hiệu suất vận động
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
                {featuredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-on-scroll opacity-0 transform translate-y-8"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <div className="text-center animate-on-scroll opacity-0 transform translate-y-8">
                <Link 
                  href="/store/products" 
                  className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:bg-gray-800 hover:scale-105 group shadow-lg"
                >
                  <span>XEM TẤT CẢ SẢN PHẨM</span>
                  <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20 animate-on-scroll opacity-0 transform translate-y-8">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏃‍♂️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Đang cập nhật sản phẩm</h3>
              <p className="text-gray-600">Sản phẩm mới đang được cập nhật</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 lg:mb-20 animate-on-scroll opacity-0 transform translate-y-8">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 break-words">
              TẠI SAO CHỌN CHÚNG TÔI
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cam kết chất lượng và hiệu suất cho vận động viên
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'HIỆU SUẤT CAO',
                description: 'Công nghệ tiên tiến nhất',
                color: 'from-gray-700 to-gray-900'
              },
              {
                icon: '🛡️',
                title: 'BỀN VỮNG',
                description: 'Chất liệu cao cấp',
                color: 'from-gray-600 to-gray-800'
              },
              {
                icon: '🎯',
                title: 'THIẾT KẾ TỐI ƯU',
                description: 'Cho vận động tối đa',
                color: 'from-gray-800 to-gray-900'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group text-center animate-on-scroll opacity-0 transform translate-y-8"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative bg-white rounded-2xl p-8 border border-gray-200 transition-all duration-500 group-hover:shadow-xl group-hover:scale-105 h-full">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-500 shadow-lg`}>
                    <span className="text-2xl text-white">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors duration-300 break-words">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-gray-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-on-scroll opacity-0 transform translate-y-8">
          <h2 className="text-3xl lg:text-4xl font-black mb-6 break-words">ĐĂNG KÝ NHẬN THÔNG TIN</h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
            Cập nhật sản phẩm mới và ưu đãi đặc biệt
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Email của bạn..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all duration-300"
            />
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg">
              ĐĂNG KÝ
            </button>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations - ĐÃ SỬA LỖI SYNTAX */}
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
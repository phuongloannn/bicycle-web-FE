// src/components/store/StoreFooter.tsx
import Link from 'next/link';

export default function StoreFooter() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/store" className="text-2xl font-bold text-white mb-4 block">
              Q-Fashion
            </Link>
            <p className="text-gray-300 mb-4">
              Cung cấp các sản phẩm thời trang chất lượng với giá cả hợp lý. 
              Cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </p>
            <div className="flex space-x-4">
              <span className="text-gray-300">Theo dõi chúng tôi:</span>
              <div className="flex space-x-2">
                <span>📘</span>
                <span>📷</span>
                <span>🐦</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link href="/store" className="text-gray-300 hover:text-white transition duration-300">Trang chủ</Link></li>
              <li><Link href="/store/products" className="text-gray-300 hover:text-white transition duration-300">Sản phẩm</Link></li>
              <li><Link href="/store/categories" className="text-gray-300 hover:text-white transition duration-300">Danh mục</Link></li>
              <li><Link href="/store/cart" className="text-gray-300 hover:text-white transition duration-300">Giỏ hàng</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📞 0123 456 789</li>
              <li>📧 support@qfashion.com</li>
              <li>📍 123 Đường ABC, Quận 1, TP.HCM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Q-Fashion. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
// src/components/payment/PaymentResult.tsx
'use client';

import Link from 'next/link';

export default function PaymentResult({
  status,
  orderId,
  paymentMethod
}: {
  status: 'success' | 'failed' | 'cancel';
  orderId: string;
  paymentMethod: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full mx-4">
      {status === 'success' ? (
        <div>
          {/* Success Icon */}
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="text-green-600"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Thanh Toán Thành Công
          </h2>
          <p className="text-gray-600 mb-2">Cảm ơn bạn đã mua sắm!</p>
          {orderId && (
            <p className="text-gray-600 mb-4">
              <strong>Mã đơn hàng:</strong> {orderId}
            </p>
          )}
        </div>
      ) : (
        <div>
          {/* Failed/Cancel Icon */}
          <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="text-red-600"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            {status === 'cancel' ? 'Thanh Toán Đã Hủy' : 'Thanh Toán Thất Bại'}
          </h2>
          <p className="text-gray-600 mb-4">
            {status === 'cancel' 
              ? 'Bạn đã hủy quá trình thanh toán.' 
              : 'Đã xảy ra lỗi trong quá trình thanh toán.'
            }
          </p>
        </div>
      )}

      {/* Payment Method */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Phương thức:</strong> {paymentMethod || 'Chưa xác định'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        {status === 'success' ? (
          <>
            <Link
              href="/store/orders"
              className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Xem Đơn Hàng
            </Link>
            <Link
              href="/store/products"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/store/cart"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Quay Lại Giỏ Hàng
            </Link>
            <Link
              href="/store/products"
              className="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </>
        )}
        
        <Link
          href="/"
          className="block w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
        >
          Về Trang Chủ
        </Link>
      </div>
    </div>
  );
}
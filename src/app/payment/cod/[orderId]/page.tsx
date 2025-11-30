'use client';

import Link from 'next/link';

export default function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: { orderId?: string }
}) {
  const orderId = searchParams?.orderId;

  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <svg
        className="mx-auto mb-4 text-green-500"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <h2 className="text-2xl font-bold text-green-600 mb-2">
        Đặt Hàng Thành Công
      </h2>
      {orderId && (
        <p className="text-gray-600 mb-4">Mã đơn hàng: {orderId}</p>
      )}
      <p className="text-gray-500 mb-6">
        Cảm ơn bạn đã đặt hàng. Nhân viên sẽ liên hệ để xác nhận và giao hàng.
      </p>
      <Link
        href="/store/products"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Quay về cửa hàng
      </Link>
    </div>
  );
}


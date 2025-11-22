'use client';

export default function PaymentResult({
  status,
  orderId,
  paymentMethod
}: {
  status: 'success' | 'failed';
  orderId: string;
  paymentMethod: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      {status === 'success' ? (
        <div>
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
            Thanh Toán Thành Công
          </h2>
          <p className="text-gray-600 mb-4">Mã đơn hàng: {orderId}</p>
        </div>
      ) : (
        <div>
          <svg
            className="mx-auto mb-4 text-red-500"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Thanh Toán Thất Bại
          </h2>
          <p className="text-gray-600 mb-4">Vui lòng thử lại sau</p>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Phương thức thanh toán: {paymentMethod}
        </p>
      </div>

      {/* ✅ Nút quay về store */}
      <div className="mt-6">
        <a
          href="/store"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Quay về cửa hàng
        </a>
      </div>
    </div>
  );
}

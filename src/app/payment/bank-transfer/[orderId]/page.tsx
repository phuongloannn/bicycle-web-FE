'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import BankTransferForm from '@/components/payment/BankTransferForm';

export default function BankTransferPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  // Lấy orderId từ URL: /payment/bank-transfer/123
  const orderId = Number(params.orderId);

  // Lấy amount từ query string: ?amount=500000
  const totalAmount = Number(searchParams.get('amount')) || 0;

  // ------------------------------
  // Countdown 15 phút
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút = 900 giây

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Chuyển đổi sang mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="container mx-auto px-4 py-8">
      <BankTransferForm orderId={orderId} totalAmount={totalAmount} />

      {/* Countdown */}
      {timeLeft > 0 ? (
        <div className="mt-4 text-red-600 font-bold text-lg">
          Thời gian hiệu lực QR code còn: {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </div>
      ) : (
        <div className="mt-4 text-gray-500 font-bold text-lg">
          QR code đã hết hạn
        </div>
      )}
    </div>
  );
}

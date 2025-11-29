'use client';

import { useState, useEffect } from 'react';
// @ts-ignore
import useQRPayment from '@/hooks/payment/useQRPayment';
import PaymentResult from './PaymentResult';

interface BankTransferFormProps {
  orderId: number;
  totalAmount: number;
}

export default function BankTransferForm({ orderId, totalAmount }: BankTransferFormProps) {
  const { qrCode, generateQR, loading, error } = useQRPayment(orderId, totalAmount);
  const [showQR, setShowQR] = useState(false);
  const [verified, setVerified] = useState<'success' | 'failed' | null>(null);

  // Countdown 15 phút
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (!showQR || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [showQR, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleGenerateQR = async () => {
    await generateQR();
    setShowQR(true);
    setTimeLeft(15 * 60);
  };

  const handleVerifyPayment = async () => {
    if (timeLeft <= 0) return;
    try {
      // TODO: gọi API verifyBankTransfer(orderId)
      setVerified('success');
    } catch {
      setVerified('failed');
    }
  };

  if (verified) {
    return <PaymentResult status={verified} orderId={String(orderId)} paymentMethod="bank_transfer" />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Thanh Toán Chuyển Khoản</h2>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700">
          Vui lòng chuyển khoản với nội dung: <span className="font-bold">ORDER-{orderId}</span>
        </p>
        <p className="text-gray-600 mt-1">Số tiền: <span className="font-semibold">{totalAmount.toLocaleString()} VND</span></p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Ngân Hàng</p>
          <p className="font-bold text-gray-800">BIDV</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Số Tài Khoản</p>
          <p className="font-bold text-gray-800">4711516220</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Chủ Tài Khoản</p>
          <p className="font-bold text-gray-800">Mai Lê Phương Loan</p>
        </div>
      </div>

      <div className="text-center mb-4">
        <button
          onClick={handleGenerateQR}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {loading ? 'Đang Tạo QR...' : 'Tạo Mã QR Chuyển Khoản'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {showQR && qrCode && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Quét Mã QR Để Thanh Toán</h3>
          <img src={qrCode} alt="QR Chuyển Khoản" className="mx-auto max-w-[280px] rounded-lg shadow-md" />

          {timeLeft > 0 ? (
            <p className="text-red-600 font-bold mt-3 text-lg">
              Thời gian hiệu lực QR code còn: {minutes.toString().padStart(2,'0')}:{seconds.toString().padStart(2,'0')}
            </p>
          ) : (
            <p className="text-gray-500 font-bold mt-3 text-lg">QR code đã hết hạn</p>
          )}

          <button
            onClick={handleVerifyPayment}
            disabled={timeLeft <= 0}
            className={`mt-4 px-6 py-2 rounded-lg text-white font-semibold ${
              timeLeft <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Tôi đã chuyển khoản
          </button>
        </div>
      )}
    </div>
  );
}

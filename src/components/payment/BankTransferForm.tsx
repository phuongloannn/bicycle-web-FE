'use client';

import { useState } from 'react';
import { useQRPayment } from '@/hooks/payment/useQRPayment';
import PaymentResult from './PaymentResult';

interface BankTransferFormProps {
  orderId: number;
  totalAmount: number;
}

export default function BankTransferForm({ orderId, totalAmount }: BankTransferFormProps) {
  const { qrCode, generateQR, loading, error } = useQRPayment(orderId, totalAmount);
  const [showQR, setShowQR] = useState(false);
  const [verified, setVerified] = useState<'success' | 'failed' | null>(null);

  const handleGenerateQR = async () => {
    await generateQR();
    setShowQR(true);
  };

  const handleVerifyPayment = async () => {
    try {
      // TODO: gọi API verifyBankTransfer(orderId)
      setVerified('success');
    } catch {
      setVerified('failed');
    }
  };

  if (verified) {
    return (
      <PaymentResult
        status={verified}
        orderId={String(orderId)}
        paymentMethod="bank_transfer"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Thanh Toán Chuyển Khoản</h2>
      <div className="space-y-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">
            Vui lòng chuyển khoản với nội dung: <span className="font-bold ml-2">ORDER-{orderId}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngân Hàng</label>
            <p className="font-bold">BIDV</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số Tài Khoản</label>
            <p className="font-bold">2601609867</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleGenerateQR}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Đang Tạo QR...' : 'Tạo Mã QR Chuyển Khoản'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {showQR && qrCode && (
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold mb-2">Quét Mã QR Để Thanh Toán</h3>
            <img src={qrCode} alt="QR Chuyển Khoản" className="mx-auto max-w-[250px] rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">Mã QR có hiệu lực trong 15 phút</p>
            <button
              onClick={handleVerifyPayment}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Tôi đã chuyển khoản
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

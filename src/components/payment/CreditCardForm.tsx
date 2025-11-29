'use client';

import { useState } from 'react';
import Cleave from 'cleave.js/react';
import { useCreditCardPayment } from '@/hooks/payment/useCreditCardPayment';
import PaymentResult from './PaymentResult';

interface CreditCardFormProps {
  orderId: number;
  totalAmount: number;
}

// Hàm bỏ dấu và viết hoa
const normalizeName = (name: string) => {
  return name
    .normalize('NFD')                // tách dấu
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .toUpperCase();                  // viết hoa toàn bộ
};

export default function CreditCardForm({ orderId, totalAmount }: CreditCardFormProps) {
  const { processCreditCardPayment, loading, error } = useCreditCardPayment();
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: name === 'cardHolderName' ? normalizeName(value) : value
    }));
  };

  const validateForm = () => {
    const { cardNumber, cardHolderName, expiryDate, cvv } = cardDetails;

    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) return 'Số thẻ phải gồm 16 chữ số';
    if (!cardHolderName.trim()) return 'Tên chủ thẻ không được để trống';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) return 'Ngày hết hạn phải có dạng MM/YY';
    if (!/^\d{3}$/.test(cvv)) return 'CVV phải gồm 3 chữ số';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }
    setValidationError(null);

    try {
      const result = await processCreditCardPayment({
        orderId,
        ...cardDetails,
        amount: totalAmount
      });
      setStatus(result?.status === 'success' ? 'success' : 'failed');
    } catch {
      setStatus('failed');
    }
  };

  if (status) {
    return <PaymentResult status={status} orderId={String(orderId)} paymentMethod="credit_card" />;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Thanh Toán Thẻ Tín Dụng</h2>

      {validationError && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded">{validationError}</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Số Thẻ</label>
        <Cleave
          options={{ creditCard: true }}
          name="cardNumber"
          value={cardDetails.cardNumber}
          onChange={handleInputChange}
          placeholder="1234 5678 9012 3456"
          className="mt-1 block w-full border rounded-md py-2 px-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tên Chủ Thẻ</label>
        <input
          type="text"
          name="cardHolderName"
          value={cardDetails.cardHolderName}
          onChange={handleInputChange}
          required
          placeholder="NGUYEN VAN A"
          className="mt-1 block w-full border rounded-md py-2 px-3 uppercase"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày Hết Hạn</label>
          <Cleave
            options={{ date: true, datePattern: ['m', 'y'] }}
            name="expiryDate"
            value={cardDetails.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            className="mt-1 block w-full border rounded-md py-2 px-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CVV</label>
          <Cleave
            options={{ blocks: [3], numericOnly: true }}
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleInputChange}
            placeholder="123"
            className="mt-1 block w-full border rounded-md py-2 px-3"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? 'Đang Xử Lý...' : `Thanh Toán ${totalAmount.toLocaleString('vi-VN')} đ`}
      </button>
    </form>
  );
}
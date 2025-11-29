// src/app/payment/result/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import PaymentResult from '../../../components/payment/PaymentResult';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();

  // Lấy các tham số từ query string
  const status = (searchParams.get('status') as 'success' | 'failed') || 'failed';
  const orderId = searchParams.get('orderId') || '';
  const method = searchParams.get('method') || '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PaymentResult status={status} orderId={orderId} paymentMethod={method} />
    </div>
  );
}